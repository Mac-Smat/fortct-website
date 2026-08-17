import { useEffect, useMemo, useState } from 'react'
import { Search, MessageCircle, ExternalLink } from 'lucide-react'
import { fetchEnquiries, updateEnquiryStatus } from '../lib/admin-api.js'
import { formatDate } from '../lib/format.js'
import { useAdminToast } from './useAdminToast.js'
import { AdminSelect, AdminInput } from './ui/AdminFields.jsx'
import { AdminBadge } from './ui/AdminBadge.jsx'
import {
  AdminLoading,
  AdminEmptyState,
  AdminErrorState,
  AdminPageHeader,
} from './ui/AdminStates.jsx'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
]

const STATUS_TONES = {
  new: 'warning',
  contacted: 'neutral',
  quoted: 'success',
  completed: 'success',
  closed: 'neutral',
}

const WA_STATUS_TONES = {
  sent: 'success',
  failed: 'danger',
  pending: 'neutral',
  not_attempted: 'neutral',
}

function waLink(number) {
  const digits = String(number ?? '').replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : null
}

function EnquiryStatusBadge({ status }) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
  return <AdminBadge tone={STATUS_TONES[status] ?? 'neutral'}>{label}</AdminBadge>
}

function WaStatusBadge({ label, status }) {
  return <AdminBadge tone={WA_STATUS_TONES[status] ?? 'neutral'}>{label}</AdminBadge>
}

function EnquiryRow({ enquiry, expanded, onToggleExpand, onChangeStatus }) {
  const [busy, setBusy] = useState(false)
  const wa = waLink(enquiry.whatsapp_number)

  return (
    <div className="rounded-[16px] border border-[#C5C8BC]/50 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:border-[#26262B] dark:bg-[#1A1A1E]">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-5">
        <div className="md:w-[28%] md:min-w-0">
          <p className="truncate text-[14px] font-semibold leading-[20px] text-[#1A1C1C] dark:text-[#F2F2F1]">
            {enquiry.full_name}
          </p>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex max-w-full items-center gap-1.5 truncate text-[12px] font-normal text-[#3D4D2B] hover:underline dark:text-[#AAB95F]"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              {enquiry.whatsapp_number}
            </a>
          )}
          {enquiry.email && (
            <p className="truncate text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]">
              {enquiry.email}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:w-[26%]">
          <EnquiryStatusBadge status={enquiry.status} />
          {enquiry.service_name_snapshot && (
            <AdminBadge tone="warning">{enquiry.service_name_snapshot}</AdminBadge>
          )}
        </div>

        <div className="md:w-[14%] md:min-w-0">
          <p className="text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]">
            {formatDate(enquiry.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
          <AdminSelect
            name={`enquiry-status-${enquiry.id}`}
            aria-label="Change enquiry status"
            value={enquiry.status}
            disabled={busy}
            onChange={async (e) => {
              const next = e.target.value
              if (next === enquiry.status) return
              setBusy(true)
              try {
                await onChangeStatus(enquiry.id, next)
              } finally {
                setBusy(false)
              }
            }}
            className="w-[130px]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </AdminSelect>
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide enquiry details' : 'View enquiry details'}
            className="inline-flex h-[32px] items-center gap-1.5 rounded-full border border-[#C5C8BC]/70 px-3 text-[12px] font-semibold text-[#45483F] transition-colors hover:border-[#3D4D2B] hover:text-[#3D4D2B] dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:border-[#AAB95F] dark:hover:text-[#AAB95F] cursor-pointer"
          >
            {expanded ? 'Hide' : 'View'}
          </button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[32px] items-center gap-1.5 rounded-full border border-[#C5C8BC]/70 px-3 text-[12px] font-semibold text-[#45483F] transition-colors hover:border-[#3D4D2B] hover:text-[#3D4D2B] dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:border-[#AAB95F] dark:hover:text-[#AAB95F]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open WhatsApp
            </a>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#C5C8BC]/40 px-4 py-4 dark:border-[#26262B]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-[#B7BBC4] dark:text-[#5C5C66]">
                Message
              </p>
              <p className="mt-1 whitespace-pre-wrap text-[13px] font-normal leading-[20px] text-[#45483F] dark:text-[#A1A1AA]">
                {enquiry.message}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:shrink-0">
              <WaStatusBadge label="FortCT notified" status={enquiry.whatsapp_notification_status} />
              <WaStatusBadge label="Customer confirmation" status={enquiry.whatsapp_customer_confirmation_status} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminEnquiriesPage() {
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [enquiries, setEnquiries] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const toast = useAdminToast()

  const load = async () => {
    setStatus('loading')
    setLoadError('')
    try {
      const rows = await fetchEnquiries()
      setEnquiries(rows)
      setStatus('ready')
    } catch (err) {
      setLoadError(err.message)
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return enquiries.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false
      if (!q) return true
      return (
        e.full_name.toLowerCase().includes(q) ||
        e.whatsapp_number.toLowerCase().includes(q) ||
        (e.email ?? '').toLowerCase().includes(q) ||
        (e.service_name_snapshot ?? '').toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      )
    })
  }, [enquiries, query, statusFilter])

  const handleChangeStatus = async (id, next) => {
    try {
      await updateEnquiryStatus(id, next)
      setEnquiries((list) =>
        list.map((e) => (e.id === id ? { ...e, status: next } : e)),
      )
      const label = STATUS_OPTIONS.find((s) => s.value === next)?.label ?? next
      toast.success(`Enquiry marked as ${label.toLowerCase()}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (status === 'loading') {
    return (
      <div>
        <AdminPageHeader title="Enquiries" subtitle="Loading enquiries…" />
        <div className="mt-6">
          <AdminLoading label="Loading enquiries…" />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <AdminPageHeader title="Enquiries" subtitle="Manage website enquiries" />
        <div className="mt-6">
          <AdminErrorState message={loadError} onRetry={load} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Enquiries"
        subtitle={`${enquiries.length} ${enquiries.length === 1 ? 'enquiry' : 'enquiries'} received`}
      />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
        <div className="relative lg:max-w-[280px] lg:flex-1">
          <Search className="pointer-events-none absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#B7BBC4] dark:text-[#5C5C66]" />
          <AdminInput
            name="enquiries-search"
            placeholder="Search enquiries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search enquiries"
            className="pl-10"
          />
        </div>
        <AdminSelect
          name="enquiry-status-filter"
          aria-label="Filter enquiries by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-[180px]"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </AdminSelect>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <AdminEmptyState
            title={enquiries.length === 0 ? 'No enquiries yet' : 'No enquiries match your filters'}
            message={
              enquiries.length === 0
                ? 'Enquiries submitted through the website will appear here.'
                : 'Try adjusting the search or status filter.'
            }
          />
        ) : (
          filtered.map((enquiry) => (
            <EnquiryRow
              key={enquiry.id}
              enquiry={enquiry}
              expanded={expandedId === enquiry.id}
              onToggleExpand={() =>
                setExpandedId((id) => (id === enquiry.id ? null : enquiry.id))
              }
              onChangeStatus={handleChangeStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}
