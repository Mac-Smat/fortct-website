import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Edit2, Save, Search } from 'lucide-react'
import { fetchSeoSettings, upsertSeoSetting } from '../lib/seo-api.js'
import { fetchPublishedProducts, fetchProductImages } from '../lib/public-api.js'
import { PAGE_META } from '../lib/seo.js'
import { isValidUrl } from '../lib/format.js'
import { useAdminToast } from './useAdminToast.js'
import { AdminButton } from './ui/AdminButton.jsx'
import { AdminInput, AdminTextarea, FieldLabel, FieldError } from './ui/AdminFields.jsx'
import { AdminBadge } from './ui/AdminBadge.jsx'
import { AdminLoading, AdminErrorState, AdminPageHeader } from './ui/AdminStates.jsx'

const PAGES = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'services', label: 'Services', path: '/services' },
  { key: 'about', label: 'About', path: '/about' },
  { key: 'contact', label: 'Contact', path: '/contact' },
]

const TITLE_MAX = 60
const DESC_MAX = 160

function PageCard({ setting, onSave, busy }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: setting?.title ?? '',
    meta_description: setting?.meta_description ?? '',
    og_image_url: setting?.og_image_url ?? '',
  })
  const [errors, setErrors] = useState({})
  const [saveBusy, setSaveBusy] = useState(false)
  const toast = useAdminToast()

  const defaults = PAGE_META[setting.page_key] ?? {}

  const validate = useCallback(() => {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required'
    else if (form.title.length > TITLE_MAX) next.title = `Title too long (max ${TITLE_MAX} chars)`
    if (!form.meta_description.trim()) next.meta_description = 'Meta description is required'
    else if (form.meta_description.length > DESC_MAX)
      next.meta_description = `Description too long (max ${DESC_MAX} chars)`
    if (form.og_image_url.trim() && !isValidUrl(form.og_image_url)) {
      next.og_image_url = 'Enter a valid URL (http/https)'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [form])

  const handleSave = useCallback(async () => {
    if (!validate()) return
    setSaveBusy(true)
    try {
      await upsertSeoSetting(setting.page_key, {
        title: form.title.trim(),
        meta_description: form.meta_description.trim(),
        og_image_url: form.og_image_url.trim() || null,
      })
      setEditing(false)
      toast.success(`${setting.label} SEO saved`)
      onSave()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaveBusy(false)
    }
  }, [form, validate, setting, onSave, toast])

  const hasData = Boolean(setting?.title || setting?.meta_description || setting?.og_image_url)

  return (
    <div
      key={setting.page_key}
      className="rounded-[20px] border border-[#C5C8BC]/50 bg-white p-6 dark:border-[#26262B] dark:bg-[#1A1A1E]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[16px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">
            {setting.label}
          </h3>
          <p className="mt-1 text-[12px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
            {setting.path} · {hasData ? 'Configured' : 'Using defaults'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminButton
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => {
              setForm({
                title: setting?.title ?? defaults.title ?? '',
                meta_description: setting?.meta_description ?? defaults.description ?? '',
                og_image_url: setting?.og_image_url ?? '',
              })
              setErrors({})
              setEditing(true)
            }}
          >
            <Edit2 className="h-4 w-4" /> {editing ? 'Cancel' : 'Edit'}
          </AdminButton>
          {hasData && (
            <AdminButton variant="outline" size="sm" disabled={busy} onClick={onSave}>
              <Save className="h-4 w-4" /> Save
            </AdminButton>
          )}
        </div>
      </div>
      {editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor={`seo-title-${setting.page_key}`} required>
              Page title
            </FieldLabel>
            <AdminInput
              id={`seo-title-${setting.page_key}`}
              name="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              error={errors.title}
              maxLength={TITLE_MAX}
              placeholder="e.g. FortCT Ltd — Premium Printing in Ibadan"
            />
            {errors.title && (
              <FieldError id={`seo-title-${setting.page_key}-error`}>{errors.title}</FieldError>
            )}
            <p className="mt-1 text-[11px] font-normal text-[#666666] dark:text-[#A1A1AA]/60">
              {form.title.length}/{TITLE_MAX} characters
            </p>
          </div>
          <div>
            <FieldLabel htmlFor={`seo-desc-${setting.page_key}`} required>
              Meta description
            </FieldLabel>
            <AdminTextarea
              id={`seo-desc-${setting.page_key}`}
              name="meta_description"
              value={form.meta_description}
              onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
              error={errors.meta_description}
              maxLength={DESC_MAX}
              rows={3}
              placeholder="Short search-result description…"
            />
            {errors.meta_description && (
              <FieldError id={`seo-desc-${setting.page_key}-error`}>
                {errors.meta_description}
              </FieldError>
            )}
            <p className="mt-1 text-[11px] font-normal text-[#666666] dark:text-[#A1A1AA]/60">
              {form.meta_description.length}/{DESC_MAX} characters
            </p>
          </div>
          <div className="md:col-span-2">
            <FieldLabel htmlFor={`seo-og-${setting.page_key}`}>
              Open Graph image URL
            </FieldLabel>
            <AdminInput
              id={`seo-og-${setting.page_key}`}
              name="og_image_url"
              value={form.og_image_url}
              onChange={(e) => setForm((f) => ({ ...f, og_image_url: e.target.value }))}
              error={errors.og_image_url}
              placeholder="https://mac-smat.github.io/fortct-website/og-image.webp"
            />
            {errors.og_image_url && (
              <FieldError id={`seo-og-${setting.page_key}-error`}>{errors.og_image_url}</FieldError>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <AdminButton variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </AdminButton>
            <AdminButton disabled={saveBusy || busy} onClick={handleSave}>
              {saveBusy ? 'Saving…' : 'Save changes'}
            </AdminButton>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-[12px] font-semibold text-[#45483F] dark:text-[#A1A1AA]">
              Title:
            </span>
            <span className="truncate max-w-[450px] text-[13px] font-normal text-[#1A1C1C] dark:text-[#F2F2F1]">
              {setting?.title || defaults.title || '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[12px] font-semibold text-[#45483F] dark:text-[#A1A1AA]">
              Description:
            </span>
            <span className="truncate max-w-[450px] text-[13px] font-normal text-[#1A1C1C] dark:text-[#F2F2F1]">
              {setting?.meta_description || defaults.description || '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[12px] font-semibold text-[#45483F] dark:text-[#A1A1AA]">
              OG image:
            </span>
            <span className="truncate max-w-[450px] text-[13px] font-normal text-[#1A1C1C] dark:text-[#F2F2F1]">
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminSeoPage() {
  const toast = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState([])
  const [audit, setAudit] = useState([])
  const [auditBusy, setAuditBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setSettings(await fetchSeoSettings())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const runAudit = useCallback(async () => {
    setAuditBusy(true)
    const issues = []
    try {
      const [products, images] = await Promise.all([
        fetchPublishedProducts(),
        fetchProductImages(),
      ])

      const titles = []
      for (const page of PAGES) {
        const setting = settings.find((s) => s.page_key === page.key) ?? {}
        const title = setting.title || PAGE_META[page.key]?.title
        const desc = setting.meta_description || PAGE_META[page.key]?.description
        if (!title || !desc) {
          issues.push({ page: page.label, severity: 'danger', message: 'Missing title or meta description' })
        }
        if (title) titles.push({ page: page.label, title })
      }
      const dupTitles = titles.filter((t, i) => titles.findIndex((x) => x.title === t.title) !== i)
      for (const t of dupTitles) {
        issues.push({ page: t.page, severity: 'warning', message: `Duplicate title: "${t.title}"` })
      }

      const imageByProduct = {}
      for (const img of images) {
        if (!imageByProduct[img.product_id]) imageByProduct[img.product_id] = []
        imageByProduct[img.product_id].push(img)
      }
      for (const product of products) {
        const missingAlt = (imageByProduct[product.id] ?? []).filter((img) => !img.alt_text?.trim())
        if (missingAlt.length > 0) {
          issues.push({
            page: 'Catalogue',
            severity: 'warning',
            message: `${product.name} has ${missingAlt.length} image(s) without alt text`,
          })
        }
      }

      for (const setting of settings) {
        if (setting.og_image_url && !isValidUrl(setting.og_image_url)) {
          issues.push({ page: setting.page_key, severity: 'danger', message: 'Invalid Open Graph image URL' })
        }
      }

      setAudit(issues)
    } catch (err) {
      toast.error(err.message || 'Audit failed')
      setAudit([])
    } finally {
      setAuditBusy(false)
    }
  }, [settings, toast])

  const handlePageSave = useCallback(() => {
    load()
  }, [load])

  const issueCounts = useMemo(
    () => ({
      danger: audit.filter((i) => i.severity === 'danger').length,
      warning: audit.filter((i) => i.severity === 'warning').length,
    }),
    [audit],
  )

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="SEO Manager" subtitle="Manage page metadata and run SEO checks" />
        <div className="mt-6"><AdminLoading label="Loading SEO settings…" /></div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <AdminPageHeader title="SEO Manager" subtitle="Manage page metadata and run SEO checks" />
        <div className="mt-6"><AdminErrorState message={error} onRetry={load} /></div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="SEO Manager"
        subtitle="Edit page titles, meta descriptions and social images; run SEO health checks"
      />
      <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <p className="text-[13px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
            Changes are stored securely in Supabase and apply to the public site.
          </p>
        </div>
        <AdminButton disabled={auditBusy} onClick={runAudit} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          {auditBusy ? 'Auditing…' : 'Run SEO audit'}
        </AdminButton>
      </div>

      {audit.length > 0 && (
        <div className="mt-6 rounded-[16px] border border-[#B42318]/30 bg-[#B42318]/5 p-4 dark:border-[#B42318]/10 dark:bg-[#B42318]/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B42318]" />
            <div>
              <p className="text-[13px] font-semibold text-[#B42318]">
                {issueCounts.danger + issueCounts.warning} SEO issue(s) detected
              </p>
              <p className="mt-1 text-[12px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                {issueCounts.danger > 0
                  ? `${issueCounts.danger} critical, ${issueCounts.warning} advisory`
                  : `${issueCounts.warning} advisory item(s) reviewed`}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[16px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">
            Page SEO settings
          </h2>
          <AdminBadge tone={settings.length === PAGES.length ? 'success' : 'neutral'}>
            {settings.length} of {PAGES.length} configured
          </AdminBadge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PAGES.map((page) => {
            const setting = settings.find((s) => s.page_key === page.key) ?? {}
            return (
              <PageCard
                key={page.key}
                setting={{ ...setting, label: page.label, path: page.path }}
                onSave={handlePageSave}
              />
            )
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[16px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">SEO audit</h2>
          <p className="text-[12px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
            Missing metadata, duplicate titles, missing image alt text and invalid URLs.
          </p>
        </div>
        {auditBusy ? (
          <div className="flex items-center justify-center py-10">
            <AdminLoading label="Running audit…" />
          </div>
        ) : audit.length === 0 ? (
          <div className="rounded-[16px] border border-[#3D4D2B]/30 bg-[#3D4D2B]/5 p-6 text-center dark:border-[#AAB95F]/10 dark:bg-[#AAB95F]/5">
            <CheckCircle2 className="mx-auto h-8 w-8 text-[#3D4D2B] dark:text-[#AAB95F]" />
            <p className="mt-3 text-[13px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
              No SEO issues found
            </p>
            <p className="mt-1 text-[12px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
              Titles, descriptions, image alt text and URLs all look good.
            </p>
          </div>
        ) : (
          <div className="rounded-[16px] border border-[#C5C8BC]/50 bg-white dark:border-[#26262B] dark:bg-[#1A1A1E]">
            <ul className="divide-y divide-[#C5C8BC]/40 dark:divide-[#26262B]">
              {audit.map((issue, i) => (
                <li key={i} className="p-4 flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <AdminBadge tone={issue.severity === 'danger' ? 'danger' : 'warning'}>
                      {issue.severity === 'danger' ? 'Critical' : 'Advisory'}
                    </AdminBadge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
                      {issue.page}
                    </p>
                    <p className="mt-0.5 text-[12px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
                      {issue.message}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}



