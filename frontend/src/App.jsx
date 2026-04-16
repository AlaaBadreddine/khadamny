import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000';

const topNavItems = [
  { label: 'Accueil', href: '#top', icon: 'home' },
  { label: 'Importer', href: '#cv-upload', icon: 'upload' },
  { label: 'Analyse', href: '#cv-text', icon: 'doc' },
  { label: 'Workflow', href: '#workflow', icon: 'grid' },
];

const heroMetrics = [
  { label: 'Flux', value: 'CV -> texte', hint: 'End-to-end validé' },
  { label: 'Stack', value: 'React + Flask', hint: 'Simple à maintenir' },
  { label: 'Base', value: 'SQLite', hint: 'MVP local' },
];

const profileStats = [
  { label: 'Upload', value: 'PDF only', hint: 'Un geste, un résultat' },
  { label: 'Lisibilité', value: 'LinkedIn-like', hint: 'Facile à gérer' },
  { label: 'Stabilité', value: 'Locale', hint: 'Backend simple' },
];

const uploadChecklist = [
  'Dépose un PDF et lance l’analyse en un clic.',
  'Le texte extrait remonte immédiatement dans le feed.',
  'La structure reste prête pour les phases skills et jobs.',
];

const workflowSteps = [
  {
    step: '1',
    title: 'Importer le CV',
    description: 'Tu ajoutes un PDF depuis un bloc d’action unique et clair.',
  },
  {
    step: '2',
    title: 'Lire le contenu',
    description: 'Flask extrait le texte et le prépare pour la page centrale.',
  },
  {
    step: '3',
    title: 'Consulter le feed',
    description: 'Le résultat s’affiche comme une carte propre, facile à relire.',
  },
];

const roadmapItems = [
  {
    phase: 'Phase 2',
    title: 'Analyse compétences',
    hint: 'Mots-clés CV -> skills -> métiers',
  },
  {
    phase: 'Phase 3',
    title: 'Jobs platform',
    hint: 'Offres, filtres et sauvegarde',
  },
  {
    phase: 'Phase 4',
    title: 'Polish & AI',
    hint: 'Score CV, recommandations, chatbot',
  },
];

function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function Icon({ name, className = 'h-5 w-5' }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'home':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="M4 11.5 12 5l8 6.5" />
          <path d="M6.5 10.5V19h11V10.5" />
        </svg>
      );
    case 'upload':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="M12 16V5" />
          <path d="M8.5 8.5 12 5l3.5 3.5" />
          <path d="M5 17.5V19h14v-1.5" />
        </svg>
      );
    case 'doc':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="M8 4.5h6L18.5 9V19H8z" />
          <path d="M14 4.5V9h4.5" />
          <path d="M10 12h4" />
          <path d="M10 15h4" />
        </svg>
      );
    case 'grid':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <rect x="4.5" y="4.5" width="5" height="5" rx="1.5" />
          <rect x="14.5" y="4.5" width="5" height="5" rx="1.5" />
          <rect x="4.5" y="14.5" width="5" height="5" rx="1.5" />
          <rect x="14.5" y="14.5" width="5" height="5" rx="1.5" />
        </svg>
      );
    case 'search':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <circle cx="11" cy="11" r="5.5" />
          <path d="m15.5 15.5 3 3" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="M15.5 17.5H8.5" />
          <path d="M18 16H6l1.5-2V10a4.5 4.5 0 0 1 9 0v4z" />
          <path d="M10 17.5a2 2 0 0 0 4 0" />
        </svg>
      );
    case 'user':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5.5 19c1.7-3.1 4-4.5 6.5-4.5s4.8 1.4 6.5 4.5" />
        </svg>
      );
    case 'spark':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="M12 3.5 13.9 9l5.5 1.9-5.5 1.9L12 18.3l-1.9-5.5L4.6 10.9 10.1 9z" />
        </svg>
      );
    case 'check':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
          <path d="m6.5 12.5 3 3 7-7" />
        </svg>
      );
    default:
      return null;
  }
}

function Surface({ children, className = '', ...props }) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`} {...props}>
      {children}
    </section>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 text-white ring-1 ring-white/10 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-white/80">{hint}</p>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">{label}</p>
      <p className="mt-2 break-words text-base font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

function ActionPill({ href, icon, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
    >
      <Icon name={icon} className="h-4 w-4" />
      <span>{children}</span>
    </a>
  );
}

function SidebarLink({ href, icon, children }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[#0a66c2] hover:bg-blue-50/70 hover:text-[#0a66c2]"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition group-hover:text-[#0a66c2]">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        {children}
      </span>
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [latestUpload, setLatestUpload] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    void loadLatestUpload();
  }, []);

  async function loadLatestUpload() {
    try {
      const response = await fetch(`${API_BASE}/api/uploads/latest`);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setLatestUpload(data.upload);
    } catch {
      // The dashboard stays usable even if the backend is not reachable yet.
    }
  }

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null;
    setSelectedFile(nextFile);
    setError('');
    setStatus('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError('Choisis un fichier PDF avant de lancer l’analyse.');
      return;
    }

    const formData = new FormData();
    formData.append('cv', selectedFile);

    setIsSubmitting(true);
    setError('');
    setStatus('Analyse du CV en cours...');

    try {
      const response = await fetch(`${API_BASE}/api/upload-cv`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur inconnue pendant l’analyse.');
      }

      setLatestUpload({
        id: data.upload_id,
        filename: data.filename,
        extracted_text: data.extracted_text,
        created_at: new Date().toISOString(),
        user_name: data.user?.name ?? 'Demo User',
        user_email: data.user?.email ?? 'demo@khadamny.tn',
      });
      setStatus('CV analysé avec succès. Le texte est affiché dans le dashboard.');
      setSelectedFile(null);
      setFileInputKey((currentKey) => currentKey + 1);
    } catch (submitError) {
      setError(submitError.message);
      setStatus('');
    } finally {
      setIsSubmitting(false);
    }
  }

  const extractedText =
    latestUpload?.extracted_text?.trim() || 'Dépose un CV PDF pour voir ici le texte extrait par le backend.';
  const textLength = latestUpload?.extracted_text?.length ?? 0;
  const latestFileName = latestUpload?.filename ?? 'Aucun fichier pour le moment';
  const latestStateLabel = latestUpload ? 'Analyse terminée' : 'En attente';
  const latestDateLabel = latestUpload?.created_at ? formatDate(latestUpload.created_at) : 'Aucune activité';
  const latestUserName = latestUpload?.user_name ?? 'Demo User';
  const latestUserEmail = latestUpload?.user_email ?? 'demo@khadamny.tn';
  const latestUploadIsReady = Boolean(latestUpload);

  return (
    <div id="top" className="min-h-screen bg-[#f4f2ef] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a66c2] text-sm font-bold text-white shadow-sm">
              K
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">Khadamny</p>
              <p className="text-sm font-semibold text-slate-900">Career dashboard</p>
            </div>
          </a>

          <div className="hidden flex-1 md:block">
            <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 shadow-inner">
              <Icon name="search" className="h-4 w-4 text-slate-400" />
              <span>Rechercher un CV, une compétence ou une opportunité...</span>
            </div>
          </div>

          <nav className="ml-auto hidden items-center gap-2 xl:flex">
            {topNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon name={item.icon} className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#0a66c2] hover:text-[#0a66c2] sm:flex">
              <Icon name="bell" className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a66c2] text-xs font-bold text-white">
                D
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold text-slate-900">Demo User</p>
                <p className="text-[11px] text-slate-500">Phase 1</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:px-8">
        <aside className="space-y-6">
          <Surface className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#0a66c2] via-[#2b7bdc] to-[#78b1f3]" />
            <div className="-mt-10 px-6 pb-6">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-sm">
                  K
                </div>
                <div className="pb-2">
                  <h1 className="text-xl font-semibold text-slate-900">Khadamny</h1>
                  <p className="text-sm text-slate-500">Career guidance system</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Une interface claire, inspirée de LinkedIn, pensée pour être simple à gérer et prête pour le MVP.
              </p>

              <div className="mt-5 space-y-3">
                {profileStats.map((item) => (
                  <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
                ))}
              </div>
            </div>
          </Surface>

          <Surface className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Raccourcis</p>
            <div className="mt-4 space-y-3">
              <SidebarLink href="#cv-upload" icon="upload">
                Importer un CV
              </SidebarLink>
              <SidebarLink href="#cv-text" icon="doc">
                Voir l’analyse
              </SidebarLink>
              <SidebarLink href="#workflow" icon="grid">
                Comprendre le flux
              </SidebarLink>
            </div>
          </Surface>
        </aside>

        <div className="space-y-6">
          <Surface className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#0a66c2] via-[#2878d7] to-[#6ba9ef] px-6 py-6 text-white sm:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
                    LinkedIn-inspired career workspace
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                    Un dashboard propre, familier, et facile à faire évoluer.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
                    Phase 1 garde une seule action claire: tu importes un PDF, le backend extrait le texte, et le résultat
                    apparaît dans un feed central net, lisible et prêt pour les prochaines phases.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <ActionPill href="#cv-upload" icon="upload">
                      Importer un CV
                    </ActionPill>
                    <ActionPill href="#cv-text" icon="doc">
                      Voir l’analyse
                    </ActionPill>
                    <ActionPill href="#workflow" icon="grid">
                      Voir le workflow
                    </ActionPill>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
                  {heroMetrics.map((metric) => (
                    <MetricCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} />
                  ))}
                </div>
              </div>
            </div>
          </Surface>

          <Surface id="cv-upload" className="scroll-mt-24 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Upload CV</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ajoute ton CV PDF</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Un seul bloc clair pour gérer l&apos;upload, lancer l&apos;analyse et garder le résultat visible dans le feed.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#0a66c2]">
                <Icon name="spark" className="h-4 w-4" />
                Phase 1 core flow
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block cursor-pointer rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-[#0a66c2] hover:bg-blue-50/60">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a66c2] text-white shadow-sm">
                      <Icon name="upload" className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900">
                        Dépose ton CV ici ou clique pour le sélectionner
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        PDF uniquement. Le backend extrait le texte et l&apos;enregistre dans SQLite pour le dashboard.
                      </p>
                      <div className="mt-3 inline-flex max-w-full rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
                        <span className="truncate">{selectedFile ? selectedFile.name : 'Aucun fichier sélectionné'}</span>
                      </div>
                    </div>
                  </div>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004182] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Analyse en cours...' : 'Analyser le CV'}
                  </button>
                  <div className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    Backend: Flask · DB: SQLite
                  </div>
                </div>

                {status ? (
                  <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {status}
                  </p>
                ) : null}

                {error ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
                ) : null}
              </form>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0a66c2] shadow-sm ring-1 ring-slate-200">
                    <Icon name="check" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Pourquoi ce design est plus simple à gérer</p>
                    <p className="text-sm text-slate-500">Une seule zone d’action principale et des cartes lisibles.</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {uploadChecklist.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0a66c2]">
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Surface>

          <Surface id="cv-text" className="scroll-mt-24 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Feed</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Dernier CV analysé</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Le contenu extrait s&apos;affiche ici comme une publication propre, facile à parcourir.
                  </p>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {latestUploadIsReady ? 'Live data' : 'No upload yet'}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StatCard label="Fichier" value={latestFileName} hint="Dernier PDF traité" />
                <StatCard label="État" value={latestStateLabel} hint={latestUploadIsReady ? 'Traitement terminé' : 'En attente d’un PDF'} />
                <StatCard label="Date" value={latestDateLabel} hint={latestUploadIsReady ? 'Dernière activité' : 'Aucune activité'} />
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
              {latestUpload ? (
                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a66c2] text-lg font-bold text-white shadow-sm">
                      D
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{latestUserName}</p>
                          <p className="text-sm text-slate-500">
                            {latestFileName} · {formatDate(latestUpload.created_at)}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0a66c2]">
                          Analyse terminée
                        </span>
                      </div>

                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Texte extrait</p>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                            {textLength} caractères
                          </span>
                        </div>
                        <pre className="mt-4 max-h-[26rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700 shadow-inner">
                          {extractedText}
                        </pre>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{latestUserEmail}</span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Phase 1</span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">Flask API</span>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
                  Aucun CV n’a encore été uploadé. Dès que tu en envoies un, le texte analysé apparaîtra ici dans un format
                  proche d’un post LinkedIn.
                </div>
              )}
            </div>
          </Surface>

          <Surface id="workflow" className="scroll-mt-24 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Workflow</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Flux de travail simple</h2>
              </div>
              <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#0a66c2]">
                Phase 1
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {workflowSteps.map((item) => (
                <article key={item.step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-2xl font-semibold text-[#0a66c2]">{item.step}</div>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </article>
              ))}
            </div>
          </Surface>
        </div>

        <aside className="space-y-6">
          <Surface className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Roadmap</p>
            <div className="mt-4 space-y-3">
              {roadmapItems.map((item, index) => (
                <div key={item.phase} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0a66c2] shadow-sm ring-1 ring-slate-200">
                    {index + 2}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.phase}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">À garder en tête</p>
            <div className="mt-4 space-y-3">
              {uploadChecklist.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0a66c2]">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Dernière activité</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Fichier</div>
              <div className="mt-1 break-words text-base font-semibold text-slate-900">{latestFileName}</div>
              <div className="mt-3 text-sm text-slate-500">{latestDateLabel}</div>
              <div className="mt-3 text-sm text-slate-500">{latestUserEmail}</div>
            </div>
          </Surface>
        </aside>
      </main>
    </div>
  );
}
