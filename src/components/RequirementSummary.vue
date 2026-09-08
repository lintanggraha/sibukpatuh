<template>
  <div class="requirement-summary" :class="{ 'is-empty': !items.length }">
    <div v-for="(item, index) in items" :key="`${item.marker}-${index}`" class="requirement-summary-item" :class="{ 'is-intro': !item.marker }">
      <span v-if="item.marker" class="requirement-summary-marker">{{ item.marker }}</span>
      <span class="requirement-summary-text">{{ item.text }}</span>
    </div>
    <span v-if="!items.length">{{ emptyText }}</span>
  </div>
</template>

<script>
export default {
  name: 'RequirementSummary',
  props: {
    text: { type: [String, Number], default: '' },
    emptyText: { type: String, default: '-' },
  },
  computed: {
    items() {
      const value = String(this.text ?? '').replace(/\s+/g, ' ').trim();
      if (!value) return [];

      // Keep the source marker visible, but render it outside the text flow so
      // the browser does not add a second automatic list number.
      const markerPattern = /(^|\s)(\(\d+\)|\d+[.)]|\([a-z]\)|[a-z][.)])\s+/gi;
      const matches = [...value.matchAll(markerPattern)];
      if (matches.length < 2) return [{ marker: '', text: value }];

      const parts = [];
      const intro = value.slice(0, matches[0].index).trim();
      if (intro) parts.push({ marker: '', text: intro });

      matches.forEach((match, index) => {
        const start = match.index + match[0].length;
        const end = index + 1 < matches.length ? matches[index + 1].index : value.length;
        const itemText = value.slice(start, end).trim();
        if (itemText) parts.push({ marker: match[2], text: itemText });
      });

      return parts.length ? parts : [{ marker: '', text: value }];
    },
  },
};
</script>

<style>
.requirement-summary {
  display: grid;
  gap: .55rem;
  color: var(--muted, #52606d);
  font-size: .82rem;
  line-height: 1.65;
}
.requirement-summary-item {
  display: grid;
  grid-template-columns: minmax(1.55rem, auto) minmax(0, 1fr);
  align-items: start;
  column-gap: .45rem;
}
.requirement-summary-item.is-intro {
  grid-template-columns: minmax(0, 1fr);
}
.requirement-summary-marker {
  min-width: 1.55rem;
  color: var(--ink, #143047);
  font-weight: 700;
  text-align: right;
}
.requirement-summary-text { min-width: 0; }
[data-bs-theme="dark"] .requirement-summary-marker { color: var(--ink, #f8fafc); }
</style>
