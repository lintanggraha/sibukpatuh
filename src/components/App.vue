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
            </nav>
          </div>
        </div>
      </header>

      <main class="framework-page">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script>
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
        route.name === "cobit";
    },
  },
  mounted() {
    this.updateActiveGroups();
    document.addEventListener("click", (event) => {
      const clickedInsideNav = event.target.closest(".framework-nav-group");
      
      if (!clickedInsideNav) {
        this.closeAllGroups();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeAllGroups();
      }
    });
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
  contain: style paint;
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
    radial-gradient(
      circle at top right,
      rgba(242, 206, 145, 0.34),
      transparent 26%
    ),
    radial-gradient(
      circle at left center,
      rgba(141, 199, 203, 0.24),
      transparent 24%
    ),
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
  margin-bottom: 1rem;
  padding: 1rem 1.05rem;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  background: rgba(255, 251, 246, 0.7);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
}

.framework-brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  text-decoration: none;
  color: inherit;
}

.framework-brand-mark {
  width: 3rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
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
  gap: 0.55rem;
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
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-width: 11rem;
  padding: 0.72rem 1.25rem;
  border-radius: 999px;
  border: 1px solid rgba(20, 78, 114, 0.08);
  color: var(--ink);
  background: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.88rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
}

.framework-nav-toggle .nav-icon {
  margin-right: 0.2rem;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.framework-nav-toggle:hover,
.framework-nav-toggle:focus,
.framework-nav-group.show .framework-nav-toggle {
  color: var(--active);
  border-color: rgba(20, 78, 114, 0.18);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 20px rgba(20, 78, 114, 0.08);
  transform: translateY(-1px);
}

.framework-nav-toggle.is-active {
  color: var(--active);
  border-color: rgba(20, 78, 114, 0.22);
  background: var(--active-soft);
  box-shadow: 0 12px 22px rgba(20, 78, 114, 0.08);
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
  border: 1px solid rgba(20, 78, 114, 0.12) !important;
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: 0 22px 42px rgba(15, 23, 42, 0.14) !important;
  backdrop-filter: blur(16px) !important;
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
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
}

.alert ul {
  margin-bottom: 0;
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
</style>
