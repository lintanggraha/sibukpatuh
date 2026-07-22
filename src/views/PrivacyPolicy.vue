<template>
  <article class="policy-page">
    <header class="policy-hero">
      <span class="policy-kicker"><i class="fas fa-shield-alt"></i> {{ $t('privacy.kicker') }}</span>
      <h1>{{ $t('privacy.title') }}</h1>
      <p>
        {{ $t('privacy.intro') }}
      </p>
      <small>{{ $t('privacy.updated') }}</small>
    </header>

    <section class="policy-section">
      <h2>{{ $tm('privacy.sections')[0][0] }}</h2>
      <p>{{ $tm('privacy.sections')[0][1] }}</p>
    </section>

    <section class="policy-section">
      <h2>{{ $t('privacy.processedTitle') }}</h2>
      <ul>
        <li v-for="item in $tm('privacy.processedItems')" :key="item">{{ item }}</li>
      </ul>
      <p>
        {{ $t('privacy.processedWarning') }}
      </p>
    </section>

    <section class="policy-section">
      <h2>{{ $t('privacy.cookiesTitle') }}</h2>
      <p>
        {{ $t('privacy.cookiesP1') }}
      </p>
      <p>
        {{ $t('privacy.cookiesP2') }}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          How Google uses information from sites or apps that use our services
        </a>.
      </p>
    </section>

    <section class="policy-section">
      <h2>{{ $tm('privacy.sections')[1][0] }}</h2>
      <p>{{ $tm('privacy.sections')[1][1] }}</p>
    </section>

    <section class="policy-section">
      <h2>{{ $t('privacy.controlsTitle') }}</h2>
      <ul>
        <li v-for="item in $tm('privacy.controlsItems')" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>{{ $tm('privacy.sections')[2][0] }}</h2>
      <p>
        {{ $tm('privacy.sections')[2][1] }}
        <a href="mailto:lintanggraha@gmail.com">lintanggraha@gmail.com</a>.
      </p>
    </section>
  </article>
</template>

<script>
export default {
  name: "PrivacyPolicy",
};
</script>

<style scoped>
.policy-page{display:grid;gap:1rem;color:#16324b}
.policy-hero{padding:1.5rem;border-radius:20px;background:#0f172a;color:#fff}
.policy-kicker{display:inline-flex;align-items:center;gap:.45rem;margin-bottom:.75rem;padding:.28rem .65rem;border-radius:999px;background:rgba(255,255,255,.08);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
.policy-hero h1{margin:0 0 .55rem;font-size:clamp(1.5rem,4vw,2.15rem);font-weight:900}
.policy-hero p{max-width:760px;margin:0 0 .75rem;color:rgba(255,255,255,.78);line-height:1.65}
.policy-hero small{color:rgba(255,255,255,.58);font-weight:700}
.policy-section{padding:1.25rem 1.4rem;border:1px solid rgba(15,23,42,.08);border-radius:16px;background:#fff}
.policy-section h2{margin:0 0 .7rem;font-size:1.05rem;font-weight:900;color:#0f172a}
.policy-section p,.policy-section li{font-size:.95rem;line-height:1.75;color:#475569}
.policy-section p:last-child,.policy-section ul:last-child{margin-bottom:0}
.policy-section a{font-weight:800;color:#0f766e}
</style>
