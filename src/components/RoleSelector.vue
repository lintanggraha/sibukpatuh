<template>
  <div class="role-selector" :class="{ 'is-active': isDropdownOpen }">
    <button 
      class="role-toggle" 
      @click.stop="toggleDropdown"
      :aria-expanded="isDropdownOpen"
      title="Ubah Kacamata Divisi"
    >
      <div class="eyes-icon">
        <i class="fas fa-eye"></i>
        <i class="fas fa-eye"></i>
      </div>
    </button>

    <div class="role-dropdown" :class="{ 'show': isDropdownOpen }">
      <div class="role-dropdown-header">
        <small>Role-Based Translator</small>
        <strong>Kacamata Multi-Divisi</strong>
      </div>
      <div class="role-dropdown-body">
        <button 
          v-for="role in roles" 
          :key="role.id"
          class="role-option"
          :class="{ 'active': activeRole === role.id }"
          @click="selectRole(role.id)"
        >
          <div class="role-option-icon">
            <i :class="`fas ${role.icon}`"></i>
          </div>
          <div class="role-option-text">
            <strong>{{ role.id === 'default' ? 'Semua (Baku)' : role.label }}</strong>
            <span>{{ getRoleDescription(role.id) }}</span>
          </div>
          <div class="role-option-check" v-if="activeRole === role.id">
            <i class="fas fa-check-circle"></i>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useFrameworkStore } from '../stores/frameworkStore';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'RoleSelector',
  setup() {
    const store = useFrameworkStore();
    const isDropdownOpen = ref(false);

    const activeRole = computed(() => store.activeRole);
    const roles = computed(() => store.roles);

    const currentRole = computed(() => {
      return roles.value.find(r => r.id === activeRole.value) || roles.value[0];
    });

    const currentRoleLabel = computed(() => {
      return currentRole.value.id === 'default' ? 'Default' : currentRole.value.label;
    });

    const currentRoleIcon = computed(() => currentRole.value.icon);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const selectRole = (roleId) => {
      store.setActiveRole(roleId);
      isDropdownOpen.value = false;
    };

    const getRoleDescription = (id) => {
      const descriptions = {
        'default': 'Teks standar dari dokumen regulasi',
        'bod': 'Ringkasan dampak bisnis & finansial',
        'sysadmin': 'Instruksi teknis & konfigurasi IT',
        'legal': 'Risiko kepatuhan & kontrak legal'
      };
      return descriptions[id] || '';
    };

    const closeDropdown = (e) => {
      if (!e.target.closest('.role-selector')) {
        isDropdownOpen.value = false;
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        isDropdownOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', closeDropdown);
      document.addEventListener('keydown', handleEscape);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
      document.removeEventListener('keydown', handleEscape);
    });

    return {
      activeRole,
      roles,
      currentRoleLabel,
      currentRoleIcon,
      isDropdownOpen,
      toggleDropdown,
      selectRole,
      getRoleDescription
    };
  }
}
</script>

<style scoped>
.role-selector {
  position: relative;
  margin-left: 0;
  z-index: 100;
}

.role-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  border-radius: 12px;
  border: 1px solid rgba(20, 78, 114, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 245, 248, 0.9) 100%);
  color: var(--ink);
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.role-toggle:hover {
  background: #fff;
  border-color: var(--active);
  box-shadow: 0 6px 16px rgba(20, 78, 114, 0.08);
  transform: translateY(-1px);
}

.role-selector.is-active .role-toggle {
  border-color: var(--active);
  background: rgba(20, 78, 114, 0.08);
  box-shadow: 0 0 0 3px rgba(20, 78, 114, 0.1);
}

.role-icon {
  color: var(--active);
  font-size: 1rem;
}

.eyes-icon {
  display: flex;
  gap: 2px;
  color: var(--active);
  font-size: 1.1rem;
}
.role-selector.is-active .eyes-icon {
  color: #fff;
}

.role-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(20, 78, 114, 0.15);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.role-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.role-dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(20, 78, 114, 0.08);
  background: rgba(20, 78, 114, 0.03);
  border-radius: 20px 20px 0 0;
}

.role-dropdown-header small {
  display: block;
  font-size: 0.7rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.role-dropdown-header strong {
  display: block;
  font-size: 0.95rem;
  color: var(--active);
}

.role-dropdown-body {
  padding: 0.5rem;
}

.role-option {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.role-option:hover {
  background: rgba(20, 78, 114, 0.04);
}

.role-option.active {
  background: rgba(20, 78, 114, 0.08);
  border-color: rgba(20, 78, 114, 0.15);
}

.role-option-icon {
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 78, 114, 0.06);
  color: var(--active);
  border-radius: 10px;
  font-size: 0.9rem;
}

.role-option.active .role-option-icon {
  background: var(--active);
  color: #fff;
}

.role-option-text strong {
  display: block;
  font-size: 0.85rem;
  color: var(--ink);
  line-height: 1.2;
}

.role-option-text span {
  display: block;
  font-size: 0.7rem;
  color: var(--muted);
  margin-top: 0.2rem;
  line-height: 1.3;
}

.role-option-check {
  color: var(--active);
  font-size: 1.1rem;
}

/* Dark Mode Support */
[data-bs-theme="dark"] .role-toggle {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e0e6ed;
}

[data-bs-theme="dark"] .role-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
}

[data-bs-theme="dark"] .role-dropdown {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

[data-bs-theme="dark"] .role-dropdown-header {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.05);
}

[data-bs-theme="dark"] .role-option:hover {
  background: rgba(255, 255, 255, 0.05);
}

[data-bs-theme="dark"] .role-option.active {
  background: rgba(72, 202, 228, 0.15);
  border-color: rgba(72, 202, 228, 0.3);
}

[data-bs-theme="dark"] .role-option-text strong {
  color: #e0e6ed;
}

@media (max-width: 991px) {
  .role-selector {
    width: auto;
  }

  .role-toggle {
    width: auto;
    justify-content: center;
  }
}
</style>
