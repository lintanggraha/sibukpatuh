/**
 * searchDeepLink — mixin generik untuk menanggapi deep-link dari Global Search.
 *
 * Global Search menavigasi ke halaman framework dengan query param:
 *   /frameworks/iso27001?q=8.24&from=search
 *
 * Tanpa penanganan, halaman tujuan terbuka di tab default ("overview") sehingga
 * pengguna harus mencari ulang secara manual. Mixin ini menutup celah tersebut.
 *
 * Cara pakai pada sebuah view:
 *   import searchDeepLink from '../mixins/searchDeepLink';
 *   export default {
 *     mixins: [searchDeepLink],
 *     // opsional, hanya bila tab eksplorasi bukan bernama 'explorer':
 *     searchDeepLinkTab: 'explorer',
 *     ...
 *   }
 *
 * Bila satu view memuat lebih dari satu dataset yang tampil di tab berbeda
 * (contoh: Nist.vue menampilkan NIST CSF di tab 'explorer' dan SP 800-53 di
 * tab 'reference'), Global Search dapat mengirim `?tab=reference` agar mixin
 * membuka tab yang benar.
 *
 * Syarat di template: elemen daftar kontrol diberi atribut
 *   :data-search-id="ctrl.id"
 * Mixin memakai atribut DOM, bukan state internal, agar tetap bekerja
 * meskipun struktur state tiap view berbeda.
 *
 * Mixin bersifat no-op bila tidak ada query `q`, sehingga aman dipasang
 * di view mana pun tanpa mengubah perilaku normal.
 */

const HIGHLIGHT_CLASS = 'search-deeplink-hit';
const HIGHLIGHT_DURATION = 2600;

// Daftar kontrol sebagian view baru ter-render setelah data dimuat, transisi
// tab selesai, dan computed turunan dihitung. Urutan hook antar view tidak
// seragam (ada yang memanggil loadData di mounted view, yang berjalan SETELAH
// mounted mixin), sehingga menunggu dengan jeda tetap tidak dapat diandalkan.
// Karena itu pencarian elemen target dilakukan dengan percobaan berulang.
const FOCUS_RETRY_INTERVAL = 120;
const FOCUS_RETRY_MAX = 25; // total ~3 detik

/** Normalisasi ID agar `A.8.24`, `a-8-24`, dan `8.24` dianggap sepadan. */
function normalizeId(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^(annex\s*)?a[.\s-]/, '')
    .replace(/^(klausa|clause|pasal|bab)\s*/, '')
    .replace(/[\s._-]/g, '');
}

export default {
  data() {
    return {
      searchDeepLinkQuery: null,
      searchDeepLinkResolved: false,
      // Aktif selama deep-link diproses. View berpaginasi memeriksa flag ini
      // agar watcher-nya tidak me-reset halaman ke 1 dan menimpa lompatan.
      searchDeepLinkPending: false,
    };
  },
  computed: {
    /**
     * Nama tab tujuan. Prioritas:
     * 1. Query param `tab` dari Global Search (untuk view multi-dataset)
     * 2. Opsi komponen `searchDeepLinkTab`
     * 3. Default 'explorer'
     */
    searchDeepLinkTabName() {
      const fromQuery = this.$route?.query?.tab;
      if (fromQuery) return String(fromQuery);
      return this.$options.searchDeepLinkTab || 'explorer';
    },
  },
  methods: {
    /**
     * Baca query param dan pindahkan tab bila perlu.
     * Dipanggil otomatis saat mounted, tapi bisa dipanggil ulang setelah
     * data selesai dimuat (lihat searchDeepLinkAfterDataLoaded).
     */
    initSearchDeepLink() {
      const raw = this.$route?.query?.q;
      if (!raw) return false;

      this.searchDeepLinkQuery = String(raw);
      this.searchDeepLinkPending = true;

      // Pindah ke tab eksplorasi agar daftar kontrol terlihat.
      if ('activeTab' in this) {
        this.activeTab = this.searchDeepLinkTabName;
      }
      return true;
    },

    /**
     * Panggil ini setelah data view selesai dimuat (akhir loadData).
     * Melakukan scroll + sorot pada elemen yang cocok.
     */
    searchDeepLinkAfterDataLoaded() {
      if (!this.searchDeepLinkQuery || this.searchDeepLinkResolved) return;
      this.searchDeepLinkResolved = true;

      // Tunggu satu tick agar computed turunan data (mis. filteredControls)
      // selesai dihitung ulang. Tanpa jeda ini, hook paginasi membaca daftar
      // yang masih kosong dan gagal menemukan halaman target.
      this.$nextTick(() => {
        // Pastikan tab tujuan aktif. initSearchDeepLink sudah melakukannya saat
        // mounted, tapi beberapa view me-reset activeTab di dalam loadData yang
        // selesai setelahnya, sehingga perlu ditegaskan ulang di sini.
        if ('activeTab' in this) {
          this.activeTab = this.searchDeepLinkTabName;
        }

        this.$nextTick(() => {
          // Hook opsional: view berpaginasi (Iso27001, Nist) memakainya untuk
          // melompat ke halaman yang memuat kontrol target lebih dulu. Tanpa
          // ini, elemen target tidak ada di DOM bila berada di halaman >1.
          if (typeof this.searchDeepLinkPrepare === 'function') {
            this.searchDeepLinkPrepare(this.searchDeepLinkQuery);
          }

          this.$nextTick(() => {
            this.searchDeepLinkFocusTarget();
          });
        });
      });
    },

    /**
     * Utilitas untuk view berpaginasi: hitung halaman yang memuat ID target.
     * Mengembalikan nomor halaman (1-based) atau null bila tidak ditemukan.
     */
    searchDeepLinkFindPage(list, perPage, idField = 'id') {
      const target = normalizeId(this.searchDeepLinkQuery);
      if (!target || !Array.isArray(list) || !perPage) return null;

      let idx = list.findIndex(it => normalizeId(it?.[idField]) === target);
      if (idx === -1) {
        idx = list.findIndex(it => normalizeId(it?.[idField]).startsWith(target));
      }
      if (idx === -1) return null;

      return Math.floor(idx / perPage) + 1;
    },

    /**
     * Cari elemen dengan data-search-id yang cocok, lalu scroll dan sorot.
     * Mencoba berulang selama elemen belum muncul di DOM, karena waktu render
     * daftar berbeda-beda antar view.
     */
    searchDeepLinkFocusTarget(attempt = 0) {
      const target = normalizeId(this.searchDeepLinkQuery);
      if (!target) return;

      // PENTING — pencarian WAJIB memakai `document`, bukan `this.$el`.
      //
      // Pada Vue 3, komponen dengan lebih dari satu elemen akar (fragment)
      // membuat `this.$el` menunjuk ke node teks penanda, bukan elemen DOM.
      // Node teks tidak punya querySelectorAll, sehingga hasilnya undefined dan
      // pencarian selalu gagal tanpa error yang terlihat. Seluruh view di
      // proyek ini memakai beberapa elemen akar, jadi `this.$el` tidak pernah
      // dapat dipakai di sini.
      const nodes = Array.from(document.querySelectorAll('[data-search-id]'));

      // Cocok persis lebih diutamakan daripada cocok sebagian.
      let hit = nodes.find(n => normalizeId(n.dataset.searchId) === target);
      if (!hit) {
        hit = nodes.find(n => normalizeId(n.dataset.searchId).startsWith(target));
      }

      if (!hit) {
        if (attempt < FOCUS_RETRY_MAX) {
          this.searchDeepLinkRetryTimer = setTimeout(
            () => this.searchDeepLinkFocusTarget(attempt + 1),
            FOCUS_RETRY_INTERVAL
          );
          return;
        }
        // Menyerah setelah batas percobaan: lepaskan penjagaan agar filter dan
        // paginasi kembali normal, dan biarkan pengguna memakai filter manual.
        this.searchDeepLinkPending = false;
        return;
      }

      // PENTING — urutan operasi di bawah tidak boleh ditukar.
      //
      // Sebagian daftar panjang memakai CSS `content-visibility: auto`
      // (contoh: `.padg-item` pada 482 pasal PADG). Browser melewatkan proses
      // render elemen yang jauh di luar viewport, sehingga elemen ada di DOM
      // tetapi belum memiliki layout. Pada kondisi itu `click()` tidak memicu
      // handler dan sorot tidak tampak.
      //
      // Karena itu: scroll lebih dulu (memaksa browser merender), tunggu satu
      // frame, baru klik dan pasang sorot. Scroll memakai `auto` alih-alih
      // `smooth` agar posisi final tercapai seketika dan tidak ada jeda
      // animasi sebelum elemen dirender.
      hit.scrollIntoView({ behavior: 'auto', block: 'center' });

      requestAnimationFrame(() => {
        // Klik agar inspector detail ikut terbuka (bila view menyediakannya).
        if (typeof hit.click === 'function') {
          hit.click();
        }

        hit.classList.add(HIGHLIGHT_CLASS);
        setTimeout(() => hit.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_DURATION);

        // Deep-link selesai; lepaskan penjagaan agar filter dan paginasi
        // kembali berperilaku normal untuk interaksi pengguna selanjutnya.
        //
        // Catatan: query param `?q=` sengaja DIBIARKAN di URL. Percobaan
        // membersihkannya lewat $router.replace() memicu re-inisialisasi
        // komponen sehingga activeTab kembali ke default dan hasil deep-link
        // hilang. Selain menghindari regresi itu, URL yang tetap utuh membuat
        // tautan hasil pencarian dapat dibagikan dan di-bookmark.
        this.searchDeepLinkPending = false;
      });
    },
  },
  mounted() {
    this.initSearchDeepLink();
  },
  beforeUnmount() {
    if (this.searchDeepLinkRetryTimer) {
      clearTimeout(this.searchDeepLinkRetryTimer);
    }
  },
};
