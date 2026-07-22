<template>
  <article class="contact-page">
    <header class="contact-hero">
      <span class="contact-kicker"><i class="fas fa-envelope-open-text"></i> {{ $t('contact.kicker') }}</span>
      <h1>{{ $t('contact.title') }}</h1>
      <p>
        {{ $t('contact.intro') }}
      </p>
    </header>

    <section class="contact-grid">
      <div class="contact-panel">
        <h2>{{ $t('contact.main') }}</h2>
        <p>
          {{ $t('contact.siteOwner') }}: <strong>Lintang</strong><br>
          Email: <a href="mailto:lintanggraha@gmail.com">lintanggraha@gmail.com</a><br>
          LinkedIn:
          <a href="https://www.linkedin.com/in/lintanggraha/" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/lintanggraha
          </a>
        </p>
      </div>

      <div class="contact-panel">
        <h2>{{ $t('contact.requestTypes') }}</h2>
        <ul>
          <li v-for="item in $tm('contact.items')" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="contact-panel">
      <h2>{{ $t('contact.responseTitle') }}</h2>
      <p>
        {{ $t('contact.responseText') }}
      </p>
    </section>
  </article>
</template>

<script>
export default {
  name: "ContactView",
};
</script>

<style scoped>
.contact-page{display:grid;gap:1rem;color:#16324b}
.contact-hero{padding:1.5rem;border-radius:20px;background:linear-gradient(135deg,#144e72 0%,#0f766e 100%);color:#fff}
.contact-kicker{display:inline-flex;align-items:center;gap:.45rem;margin-bottom:.75rem;padding:.28rem .65rem;border-radius:999px;background:rgba(255,255,255,.12);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
.contact-hero h1{margin:0 0 .55rem;font-size:clamp(1.5rem,4vw,2.15rem);font-weight:900}
.contact-hero p{max-width:760px;margin:0;color:rgba(255,255,255,.82);line-height:1.65}
.contact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.contact-panel{padding:1.25rem 1.4rem;border:1px solid rgba(15,23,42,.08);border-radius:16px;background:#fff}
.contact-panel h2{margin:0 0 .7rem;font-size:1.05rem;font-weight:900;color:#0f172a}
.contact-panel p,.contact-panel li{font-size:.95rem;line-height:1.75;color:#475569}
.contact-panel p:last-child,.contact-panel ul:last-child{margin-bottom:0}
.contact-panel a{font-weight:800;color:#0f766e}
@media (max-width: 767.98px){.contact-grid{grid-template-columns:1fr}}
</style>
