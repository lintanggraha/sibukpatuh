<template>
  <div class="framework-shell">
    <div class="container-xl">
      <header class="framework-header">
        <div class="row g-3 align-items-center">
          <div class="col-lg-4">
            <router-link to="/" class="framework-brand">
              <span class="framework-brand-mark">
                <i class="fas fa-layer-group"></i>
              </span>
              <span class="framework-brand-copy">
                <small>SibukPatuh</small>
                <strong>Sistem Informasi Biar Update Kepatuhan</strong>
              </span>
            </router-link>
          </div>
          <div class="col-lg-8">
            <nav class="framework-nav navigation-optimized" aria-label="Framework navigation">
              <div
                v-for="group in frameworkNavGroups"
                :key="group.label"
                class="framework-nav-group"
                :class="{ show: group.show }"
              >
                <button
                  class="framework-nav-toggle"
                  :class="{ 'is-active': group.active }"
                  type="button"
                  @click.stop="toggleGroup(group)"
                  aria-expanded="false"
                >
                  <i :class="`fas ${group.icon}`" class="nav-icon"></i>
                  <span>{{ group.label }}</span>
                </button>

                <div
                  class="framework-dropdown"
                  :class="{ show: group.show }"
                >
                  <router-link
                    v-for="item in group.items"
                    :key="item.route"
                    :to="{ name: item.routeName }"
                    class="dropdown-item"
                    :class="{ 'is-active': isActiveRoute(item.routeName) }"
                    @click="closeAllGroups"
                  >
                    <i :class="`fas ${item.icon}`" class="dropdown-icon"></i>
                    <span>{{ item.label }}</span>
                  </router-link>
                </div>
              </div>

              <router-link to="/about" class="framework-nav-toggle" style="text-decoration: none;" :class="{ 'is-active': isActiveRoute('about') }" @click="closeAllGroups">
                 <i class="fas fa-info-circle nav-icon"></i>
                 <span>Tentang</span>
              </router-link>
            </nav>
          </div>
        </div>
      </header>

      <main class="framework-page">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="$route.fullPath" class="route-wrapper">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </main>
      <!-- Trakteer Tip Floating Button -->
      <a 
        href="https://trakteer.id/lintanggraha/tip" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="trakteer-fab"
        aria-label="Dukung saya di Trakteer"
      >
        <div class="trakteer-pulse"></div>
        <div class="trakteer-content">
          <i class="fas fa-mug-hot"></i>
          <span>Traktir Kopi</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { useFrameworkStore } from '../stores/frameworkStore';

export default {
  name: "App",
  data() {
    return {
      frameworkNavGroups: [
        {
          label: "Nasional",
          icon: "fa-landmark",
          active: false,
          show: false,
          items: [
            {
              routeName: "seojk",
              label: "SEOJK 29 03/2022",
              icon: "fa-landmark",
            },
            {
              routeName: "resilience",
              label: "Panduan Resiliensi OJK",
              icon: "fa-layer-group",
            },
            { routeName: "pbi", label: "PBI 02/2024", icon: "fa-university" },
          ],
        },
        {
          label: "Internasional",
          icon: "fa-globe-asia",
          active: false,
          show: false,
          items: [
            {
              routeName: "iso27001",
              label: "ISO 27001",
              icon: "fa-shield-alt",
            },
            { routeName: "nist", label: "NIST CSF 2.0", icon: "fa-compass" },
            {
              routeName: "cobit",
              label: "COBIT 2019",
              icon: "fa-project-diagram",
            },
            {
              routeName: "owasp_top10",
              label: "OWASP Top 10",
              icon: "fa-bug",
            },
            {
              routeName: "owasp_asvs",
              label: "OWASP ASVS",
              icon: "fa-check-double",
            },
          ],
        },
        {
          label: "Intelijen",
          icon: "fa-shield-virus",
          active: false,
          show: false,
          items: [
            {
              routeName: "cve_intel",
              label: "CVE Terbaru",
              icon: "fa-bug",
            },
          ],
        },
      ],
    };
  },
  computed: {
    activeGroup() {
      return this.frameworkNavGroups.find(group => group.active);
    },
  },
  watch: {
    $route() {
      this.updateActiveGroups();
    },
  },
  methods: {
    handleClickOutside(event) {
      const clickedInsideNav = event.target.closest(".framework-nav-group");
      if (!clickedInsideNav) {
        this.closeAllGroups();
      }
    },
    handleKeydown(event) {
      if (event.key === "Escape") {
        this.closeAllGroups();
      }
    },
    isActiveRoute(routeName) {
      return this.$route.name === routeName;
    },
    toggleGroup(group) {
      this.frameworkNavGroups.forEach((g) => {
        if (g !== group) {
          g.show = false;
        }
      });
      group.show = !group.show;
    },
    closeAllGroups() {
      this.frameworkNavGroups.forEach((g) => {
        g.show = false;
      });
      // Also sync with Pinia store
      const store = useFrameworkStore();
      store.closeAllGroups();
    },
    updateActiveGroups() {
      const route = this.$route;
      this.frameworkNavGroups[0].active =
        route.name === "seojk" ||
        route.name === "resilience" ||
        route.name === "pbi";
      this.frameworkNavGroups[1].active =
        route.name === "iso27001" ||
        route.name === "nist" ||
        route.name === "cobit" ||
        route.name === "owasp_top10" ||
        route.name === "owasp_asvs";
      this.frameworkNavGroups[2].active =
        route.name === "cve_intel";
      
      // Sync with Pinia store
      const store = useFrameworkStore();
      store.updateActiveGroups(route.name);
    },
  },
  mounted() {
    this.updateActiveGroups();
    document.addEventListener("click", this.handleClickOutside);
    document.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-padding-top: 1rem;
  scroll-behavior: auto;
  overflow-x: hidden;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Native scrolling - no forced smooth */
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(20, 78, 114, 0.2) transparent;
}

/* Custom scrollbar - thin and elegant */
body::-webkit-scrollbar {
  width: 8px;
}

body::-webkit-scrollbar-track {
  background: transparent;
}

body::-webkit-scrollbar-thumb {
  background: rgba(20, 78, 114, 0.2);
  border-radius: 999px;
  transition: background 0.2s ease;
}

body::-webkit-scrollbar-thumb:hover {
  background: rgba(20, 78, 114, 0.4);
}

body::-webkit-scrollbar-thumb:active {
  background: rgba(20, 78, 114, 0.6);
}

/* Native scrolling for internal lists */
.iso-list,
.sej-list,
.nst-list,
.cob-list,
.pbi-list,
.orj-list {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(20, 78, 114, 0.15) transparent;
}

.iso-list::-webkit-scrollbar,
.sej-list::-webkit-scrollbar,
.nst-list::-webkit-scrollbar,
.cob-list::-webkit-scrollbar,
.pbi-list::-webkit-scrollbar,
.orj-list::-webkit-scrollbar {
  width: 6px;
}

.iso-list::-webkit-scrollbar-track,
.sej-list::-webkit-scrollbar-track,
.nst-list::-webkit-scrollbar-track,
.cob-list::-webkit-scrollbar-track,
.pbi-list::-webkit-scrollbar-track,
.orj-list::-webkit-scrollbar-track {
  background: transparent;
}

.iso-list::-webkit-scrollbar-thumb,
.sej-list::-webkit-scrollbar-thumb,
.nst-list::-webkit-scrollbar-thumb,
.cob-list::-webkit-scrollbar-thumb,
.pbi-list::-webkit-scrollbar-thumb,
.orj-list::-webkit-scrollbar-thumb {
  background: rgba(20, 78, 114, 0.15);
  border-radius: 999px;
  transition: background 0.15s ease;
}

.iso-list::-webkit-scrollbar-thumb:hover,
.sej-list::-webkit-scrollbar-thumb:hover,
.nst-list::-webkit-scrollbar-thumb:hover,
.cob-list::-webkit-scrollbar-thumb:hover,
.pbi-list::-webkit-scrollbar-thumb:hover,
.orj-list::-webkit-scrollbar-thumb:hover {
  background: rgba(20, 78, 114, 0.3);
}

/* Render optimization without forced GPU layers */
.iso-item,
.sej-item,
.nst-item,
.cob-item,
.pbi-item,
.orj-item {
  contain: layout style paint;
  content-visibility: auto;
  contain-intrinsic-size: auto 84px;
}

/* Page transition animations - simple and fast */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

:root {
  --canvas-top: #f5efe4;
  --canvas-bottom: #eaf3f3;
  --ink: #16324b;
  --muted: #5c6776;
  --shell: rgba(255, 251, 246, 0.76);
  --active: #144e72;
  --active-soft: rgba(20, 78, 114, 0.1);
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--ink);
  background:
    linear-gradient(180deg, var(--canvas-top) 0%, var(--canvas-bottom) 100%);
}

.framework-shell {
  min-height: 100vh;
  padding: 1.25rem 0 2rem;
}

.framework-header {
  position: relative;
  z-index: 20;
  overflow: visible;
  margin-bottom: 0.8rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  background: rgba(255, 251, 246, 0.7);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
}

.framework-brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  text-decoration: none;
  color: inherit;
}

.framework-brand-mark {
  width: 2.8rem;
  height: 2.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: #fffaf2;
  background: linear-gradient(135deg, #16324b 0%, #1f6f78 100%);
  box-shadow: 0 12px 22px rgba(22, 50, 75, 0.18);
}

.framework-brand-copy small,
.framework-helper {
  display: block;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.framework-brand-copy strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.2;
}

.framework-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: flex-end;
}

.framework-nav-group {
  position: relative;
}

.framework-nav-group.show {
  z-index: 30;
}

.framework-nav-toggle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 5.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  border: 1px solid transparent;
  color: var(--muted);
  background: transparent;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.72rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.framework-nav-toggle .nav-icon {
  margin-right: 0;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.framework-nav-toggle:hover,
.framework-nav-toggle:focus,
.framework-nav-group.show .framework-nav-toggle {
  color: var(--active);
  background: rgba(20, 78, 114, 0.05);
}

.framework-nav-toggle.is-active {
  color: var(--active);
  border-bottom: 2px solid var(--active);
  border-radius: 12px 12px 0 0;
  background: transparent;
}

.framework-nav-toggle::after {
  margin-left: 0.15rem;
}

.framework-dropdown {
  position: absolute !important;
  top: calc(100% + 0.65rem) !important;
  right: 0 !important;
  left: auto !important;
  z-index: 1200 !important;
  min-width: 16.5rem !important;
  padding: 0.45rem !important;
  border: 1px solid rgba(20, 78, 114, 0.15) !important;
  border-radius: 20px !important;
  background: #fff !important;
  box-shadow: 0 22px 42px rgba(15, 23, 42, 0.12) !important;
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  margin-top: 0 !important;
}

.framework-dropdown.show {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.framework-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.82rem 0.95rem;
  border-radius: 16px;
  color: var(--ink);
  font-weight: 700;
  font-size: 0.84rem;
  white-space: normal;
}

.framework-dropdown .dropdown-item .dropdown-icon,
.framework-dropdown .dropdown-item i {
  width: 1rem;
  margin-right: 0.15rem;
  color: var(--muted);
  text-align: center;
  flex-shrink: 0;
}

.framework-dropdown .dropdown-item:hover,
.framework-dropdown .dropdown-item:focus {
  color: var(--active);
  background: rgba(20, 78, 114, 0.08);
}

.framework-dropdown .dropdown-item.is-active {
  color: var(--active);
  background: rgba(20, 78, 114, 0.12);
}

.framework-dropdown .dropdown-item.is-active i,
.framework-dropdown .dropdown-item:hover i,
.framework-dropdown .dropdown-item:focus i {
  color: var(--active);
}

.framework-page {
  position: relative;
  z-index: 1;
  padding: 1rem;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: var(--shell);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07);
}

.route-wrapper {
  width: 100%;
  height: 100%;
}

.alert ul {
  margin-bottom: 0;
}

/* Scroll performance guardrails.
   Large backdrop blurs and oversized shadows repaint heavily while scrolling,
   especially in Firefox and mobile browsers. Keep the visual language, but use
   cheap translucent surfaces instead of live glass effects. */
.framework-header,
.framework-page,
.framework-dropdown,
.frx-disclaimer,
.about-card,
.iso-metric,
.iso-side-card,
.modal-overlay {
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

.iso-panel,
.sej-panel,
.nst-panel,
.cob-panel,
.pbi-panel,
.orj-panel,
.frx-card,
.about-card {
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.055) !important;
}

.iso-detail-body,
.sej-inspector-body,
.nst-inspector-body,
.cob-inspector-body,
.pbi-inspector-body,
.orj-inspector-body {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

@media (max-width: 767.98px) {
  .framework-shell {
    padding: 0.75rem 0 1rem;
  }

  .framework-header {
    border-radius: 20px;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  }

  .framework-page {
    padding: 0.65rem;
    border-radius: 20px;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.055);
  }

  .iso-list,
  .sej-list,
  .nst-list,
  .cob-list,
  .pbi-list,
  .orj-list,
  .iso-detail-body,
  .sej-inspector-body,
  .nst-inspector-body,
  .cob-inspector-body,
  .pbi-inspector-body,
  .orj-inspector-body {
    max-height: none !important;
    overflow: visible !important;
    padding-right: 0 !important;
  }

  .iso-inspector-panel,
  .sej-inspector,
  .nst-inspector,
  .cob-inspector,
  .pbi-inspector,
  .orj-inspector {
    min-height: auto !important;
    max-height: none !important;
  }

  .framework-nav-toggle,
  .iso-tab,
  .sej-tab,
  .nst-tab,
  .cob-tab,
  .pbi-tab,
  .orj-tab {
    transition:
      background-color 0.12s ease,
      border-color 0.12s ease,
      color 0.12s ease !important;
  }

  .framework-nav-toggle:hover,
  .framework-nav-toggle:focus,
  .framework-nav-group.show .framework-nav-toggle,
  .iso-bar.jump:hover,
  .sej-bar:hover,
  .sej-hotspot:hover,
  .sej-family:hover,
  .orj-bar:hover,
  .orj-family:hover,
  .frx-card:hover,
  .about-card:hover,
  .feature-item:hover,
  .btn-contact:hover {
    transform: none !important;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.12s ease !important;
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 1440px) {
  .framework-nav-toggle {
    min-width: 9.5rem;
    padding: 0.65rem 1rem;
    font-size: 0.82rem;
  }
  .framework-brand-copy strong {
    font-size: 0.95rem;
  }
  .framework-header {
    margin-bottom: 0.65rem;
  }
}

@media (max-width: 991.98px) {
  .framework-header {
    padding: 1rem;
  }

  .framework-header .row {
    gap: 1rem;
  }

  .framework-nav {
    justify-content: flex-start;
  }

  .framework-nav-group,
  .framework-nav-toggle {
    width: 100%;
  }

  .framework-dropdown {
    right: 0;
    left: 0;
    min-width: 100%;
  }
}

/* Trakteer Floating Button Styles */
.trakteer-fab {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.trakteer-content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #FF5E5E 0%, #FF2E63 100%);
  color: white !important;
  font-weight: 800;
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 25px rgba(255, 46, 99, 0.4);
  position: relative;
  z-index: 2;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.trakteer-content i {
  font-size: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.trakteer-fab:hover {
  transform: scale(1.08) translateY(-8px) rotate(2deg);
}

.trakteer-fab:active {
  transform: scale(0.95) translateY(0);
}

.trakteer-pulse {
  position: absolute;
  width: 110%;
  height: 110%;
  border-radius: 999px;
  background: rgba(255, 46, 99, 0.3);
  z-index: 1;
  animation: trakteer-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes trakteer-ping {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  75%, 100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

@media (max-width: 767.98px) {
  .trakteer-fab {
    bottom: 1.5rem;
    right: 1.5rem;
  }
  .trakteer-content span {
    display: none;
  }
  .trakteer-content {
    padding: 1rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
  .trakteer-content i {
    margin: 0;
    font-size: 1.2rem;
  }
  .trakteer-pulse {
    width: 100%;
    height: 100%;
  }
}
</style>
