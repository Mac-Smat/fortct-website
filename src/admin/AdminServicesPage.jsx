import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Star, Copy, Eye, EyeOff } from 'lucide-react'
import {
  fetchProducts,
  fetchCategories,
  fetchPrimaryImages,
  archiveProduct,
  duplicateProduct,
  setProductFeatured,
} from '../lib/admin-api.js'
import { formatPrice, formatDate } from '../lib/format.js'
import { useAdminToast } from './AdminToast.jsx'
import { AdminButton, AdminIconButton } from './ui/AdminButton.jsx'
import { AdminSelect, AdminInput } from './ui/AdminFields.jsx'
import { StatusBadge, AdminBadge } from './ui/AdminBadge.jsx'
import {
  AdminLoading,
  AdminEmptyState,
  AdminErrorState,
  AdminPageHeader,
} from './ui/AdminStates.jsx'
import { ConfirmDialog } from './ui/AdminModal.jsx'
import { cn } from '../lib/utils.js'

const PAGE_SIZE = 20

const SORT_OPTIONS = [
  { value: 'sort_order', label: 'Sort order' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'price_high', label: 'Price (high → low)' },
  { value: 'price_low', label: 'Price (low → high)' },
  { value: 'updated', label: 'Last updated' },
]

function Thumb({ imageUrl }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#C5C8BC]/40 bg-[#E7E7E4] dark:border-[#26262B] dark:bg-[#26262B]">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-[9px] font-semibold uppercase tracking-[0.4px] text-[#45483F]/40 dark:text-[#A1A1AA]/40">
          No img
        </span>
      )}
    </div>
  )
}

function ProductRow({ product, primaryUrl, onEdit, onRequestArchive, onDuplicate, onToggleFeatured }) {
  const [busy, setBusy] = useState(null)

  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-[#C5C8BC]/50 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:border-[#26262B] dark:bg-[#1A1A1E] md:flex-row md:items-center md:gap-5">
      <div className="flex items-center gap-4 md:w-[34%] md:min-w-0">
        <Thumb imageUrl={primaryUrl} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-[20px] text-[#1A1C1C] dark:text-[#F2F2F1]">
            {product.name}
          </p>
          <p className="truncate text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]">
            /{product.slug}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:w-[24%]">
        <StatusBadge status={product.status} />
        <AdminBadge tone="warning">{product.categories?.name ?? '—'}</AdminBadge>
      </div>

      <div className="md:w-[16%] md:min-w-0">
        <p className="truncate text-[13px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">
          {formatPrice(product)}
        </p>
        <p className="text-[11px] font-normal uppercase tracking-[0.4px] text-[#666666] dark:text-[#A1A1AA]">
          {product.pricing_type.replace('_', ' ')}
        </p>
      </div>

      <div className="md:w-[10%] md:min-w-0">
        <p className="text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]">
          {formatDate(product.updated_at)}
        </p>
      </div>

      <div className="flex items-center gap-1.5 md:ml-auto">
        <button
          type="button"
          onClick={() => onToggleFeatured(product)}
          disabled={busy !== null}
          aria-label={product.featured ? 'Remove featured' : 'Mark featured'}
          title={product.featured ? 'Featured' : 'Not featured'}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer',
            product.featured
              ? 'bg-[#E0EC38] text-[#1B1D00]'
              : 'text-[#B7BBC4] hover:bg-[#E2E2E2]/60 dark:text-[#5C5C66] dark:hover:bg-white/10',
          )}
        >
          <Star className="h-4 w-4" fill={product.featured ? 'currentColor' : 'none'} />
        </button>
        <AdminButton variant="outline" size="sm" onClick={() => onEdit(product)}>
          Edit
        </AdminButton>
        <AdminIconButton
          label="Duplicate service"
          onClick={async () => {
            setBusy('duplicate')
            try {
              await onDuplicate(product)
            } finally {
              setBusy(null)
            }
          }}
        >
          <Copy className="h-4 w-4" />
        </AdminIconButton>
        <AdminButton
          variant={product.status === 'published' ? 'danger' : 'outline'}
          size="sm"
          onClick={() => onRequestArchive(product)}
        >
          {product.status === 'published' ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Archive
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Publish
            </>
          )}
        </AdminButton>
      </div>
    </div>
  )
}

export default function AdminServicesPage() {
  const navigate = useNavigate()
  const toast = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [products, setProducts] = useState([])
  const [primaryUrls, setPrimaryUrls] = useState({})
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('sort_order')
  const [page, setPage] = useState(1)
  const [archiveTarget, setArchiveTarget] = useState(null)

  const load = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const [productsData, categoriesData, imagesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchPrimaryImages(),
      ])
      const urls = {}
      for (const img of imagesData) {
        urls[img.product_id] = img.image_url
      }
      setProducts(productsData)
      setCategories(categoriesData)
      setPrimaryUrls(urls)
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.slug.includes(q)) return false
      if (categoryFilter !== 'all' && p.category_id !== categoryFilter) return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (featuredFilter === 'featured' && !p.featured) return false
      if (featuredFilter === 'not' && p.featured) return false
      return true
    })
    const sorted = [...list]
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price_high':
        sorted.sort((a, b) => Number(b.price ?? -1) - Number(a.price ?? -1))
        break
      case 'price_low':
        sorted.sort((a, b) => Number(a.price ?? -1) - Number(b.price ?? -1))
        break
      case 'updated':
        sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        break
      default:
        break
    }
    return sorted
  }, [products, query, categoryFilter, statusFilter, featuredFilter, sortBy])

  useEffect(() => {
    setPage(1)
  }, [query, categoryFilter, statusFilter, featuredFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const applyArchive = async (product) => {
    const next = product.status === 'published' ? 'hidden' : 'published'
    try {
      await archiveProduct(product.id, next === 'hidden')
      toast.success(
        next === 'hidden'
          ? `"${product.name}" archived — hidden from the public site`
          : `"${product.name}" published`,
      )
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDuplicate = async (product) => {
    try {
      const copy = await duplicateProduct(product.id)
      toast.success(`Duplicated as "${copy.name}" (hidden until published)`)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleToggleFeatured = async (product) => {
    try {
      await setProductFeatured(product.id, !product.featured)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loadError && products.length === 0) {
    return (
      <div>
        <AdminPageHeader title="Services" subtitle="Manage the FortCT catalogue" />
        <div className="mt-6">
          <AdminErrorState message={loadError} onRetry={load} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Services"
        subtitle={`${products.length} services in the catalogue`}
        actions={
          <AdminButton onClick={() => navigate('/admin/services/new')}>
            <Plus className="h-4 w-4" />
            Add service
          </AdminButton>
        }
      />

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
        <div className="relative lg:max-w-[280px] lg:flex-1">
          <Search className="pointer-events-none absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#B7BBC4] dark:text-[#5C5C66]" />
          <AdminInput
            name="services-search"
            placeholder="Search services…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search services"
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <AdminSelect
            name="category-filter"
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-[180px]"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect
            name="status-filter"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-[140px]"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </AdminSelect>
          <AdminSelect
            name="featured-filter"
            aria-label="Filter by featured"
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="w-[150px]"
          >
            <option value="all">Featured: all</option>
            <option value="featured">Featured only</option>
            <option value="not">Not featured</option>
          </AdminSelect>
          <AdminSelect
            name="sort-by"
            aria-label="Sort services"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-[180px]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AdminSelect>
        </div>
      </div>

      {/* Results */}
      <div className="mt-5">
        {loading && products.length === 0 ? (
          <AdminLoading label="Loading services…" />
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            title="No services match"
            message="Try a different search term or clear some filters."
          />
        ) : (
          <>
            <p
              className="mb-3 text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]"
              role="status"
            >
              {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
              {query.trim() ? ` matching "${query.trim()}"` : ''}
            </p>
            <div className="flex flex-col gap-3">
              {pageItems.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  primaryUrl={primaryUrls[product.id]}
                  onEdit={() => navigate(`/admin/services/${product.id}`)}
                  onRequestArchive={setArchiveTarget}
                  onDuplicate={handleDuplicate}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <AdminButton
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </AdminButton>
                <span className="px-2 text-[13px] font-semibold text-[#45483F] dark:text-[#A1A1AA]">
                  Page {page} of {totalPages}
                </span>
                <AdminButton
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </AdminButton>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={archiveTarget !== null}
        title={
          archiveTarget?.status === 'published' ? 'Archive service?' : 'Publish service?'
        }
        message={
          archiveTarget?.status === 'published'
            ? `"${archiveTarget?.name}" will be hidden from the public website. You can publish it again at any time.`
            : `"${archiveTarget?.name}" will become visible on the public website.`
        }
        confirmLabel={archiveTarget?.status === 'published' ? 'Archive' : 'Publish'}
        onClose={() => setArchiveTarget(null)}
        onConfirm={async () => {
          if (archiveTarget) await applyArchive(archiveTarget)
          setArchiveTarget(null)
        }}
      />
    </div>
  )
}