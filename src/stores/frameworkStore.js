/**
 * Framework Navigation Store
 * Manages shared navigation and UI state across framework views
 */
import { defineStore } from 'pinia';

export const useFrameworkStore = defineStore('framework', {
  state: () => ({
    // Current active framework group
    activeFrameworkGroup: null, // 'nasional' | 'internasional' | null
    
    // Current language - synced from App.vue
    currentLanguage: localStorage.getItem('language') || 'id',
    
    // Active Role for Regulation Translator
    activeRole: 'default',
    roles: [
      { id: 'default', labelKey: 'role.semuaBaku', icon: 'fa-eye' },
      { id: 'bod', labelKey: 'role.roleBod', icon: 'fa-user-tie' },
      { id: 'sysadmin', labelKey: 'role.roleSysadmin', icon: 'fa-terminal' },
      { id: 'legal', labelKey: 'role.roleLegal', icon: 'fa-balance-scale' }
    ],
    
    // Navigation dropdown states
    navGroups: [
      {
        id: 'nasional',
        label: 'Nasional',
        icon: 'fa-landmark',
        active: false,
        show: false,
        items: ['seojk', 'padk', 'resilience', 'pbi', 'padg', 'pdp'],
      },
      {
        id: 'internasional',
        label: 'Internasional',
        icon: 'fa-globe-asia',
        active: false,
        show: false,
        items: ['iso27001', 'iso37001', 'nist', 'cobit', 'owasp_top10', 'owasp_asvs'],
      },
    ],
    
    // Loading state (shared across views)
    isLoading: false,
    
    // Last visited route per framework
    lastVisited: {},
  }),
  
  getters: {
    activeGroup: (state) => {
      return state.navGroups.find(group => group.active) || null;
    },
    
    isGroupActive: (state) => (groupId) => {
      return state.navGroups.some(g => g.id === groupId && g.active);
    },
    
    isGroupShowing: (state) => (groupId) => {
      return state.navGroups.some(g => g.id === groupId && g.show);
    },
  },
  
  actions: {
    /**
     * Update active groups based on current route
     */
    updateActiveGroups(routeName) {
      this.navGroups[0].active = ['seojk', 'padk', 'resilience', 'pbi', 'padg', 'pdp'].includes(routeName);
      this.navGroups[1].active = ['iso27001', 'iso37001', 'nist', 'cobit', 'owasp_top10', 'owasp_asvs'].includes(routeName);
      
      if (this.navGroups[0].active) {
        this.activeFrameworkGroup = 'nasional';
      } else if (this.navGroups[1].active) {
        this.activeFrameworkGroup = 'internasional';
      } else {
        this.activeFrameworkGroup = null;
      }
      
      // Track last visited
      if (routeName) {
        this.lastVisited[this.activeFrameworkGroup] = routeName;
      }
    },
    
    /**
     * Toggle navigation dropdown group
     */
    toggleGroup(groupId) {
      const group = this.navGroups.find(g => g.id === groupId);
      if (!group) return;
      
      // Close all other groups
      this.navGroups.forEach(g => {
        if (g.id !== groupId) {
          g.show = false;
        }
      });
      
      group.show = !group.show;
    },
    
    /**
     * Close all navigation dropdowns
     */
    closeAllGroups() {
      this.navGroups.forEach(g => {
        g.show = false;
      });
    },
    
    /**
     * Set loading state
     */
    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
    
    /**
     * Set active role for translator
     */
    setActiveRole(roleId) {
      this.activeRole = roleId;
    },
  },
});
