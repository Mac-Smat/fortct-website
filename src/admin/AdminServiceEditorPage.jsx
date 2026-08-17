import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUp, ArrowDown, Star, Trash2, Upload } from 'lucide-react'
import {
  fetchProduct,
  fetchCategories,
  fetchProductImages,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProductImage,
  setPrimaryImage,
  reorderProductImages,
} from '../lib/admin-api.js'
import { slugify, PRICING_TYPES, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '../lib/format.js'
import { useAdminToast } from './useAdminToast.js'
import { AdminButton } from './ui/AdminButton.jsx'
import { AdminInput, AdminSelect, AdminTextarea, FieldLabel, FieldError } from './ui/AdminFields.jsx'
import { AdminLoading, AdminErrorState, AdminPageHeader } from './ui/AdminStates.jsx'
import { ConfirmDialog } from './ui/AdminModal.jsx'
import { cn } from '../lib/utils.js'

function ImageCard({ image, index, total, onSetPrimary, onDelete, onMove, busy }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[16px] border bg-[#E7E7E4] dark:bg-[#26262B]',
        image.is_primary ? 'border-[#E0EC38]' : 'border-[#C5C8BC]/50 dark:border-[#26262B]',
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img src={image.image_url} alt={image.alt_text ?? ''} className="h-full w-full object-cover" />
        {image.is_primary && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#E0EC38] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#1B1D00]">
            <Star className="h-3 w-3" fill="currentColor" />
            Primary
          </span>
        )}
      </div>
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={busy || image.is_primary}
            onClick={() => onSetPrimary()}
            aria-label="Set as primary image"
            title={image.is_primary ? 'Primary image' : 'Set as primary image'}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#45483F] transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-30 dark:text-[#A1A1AA] dark:hover:bg-white/10 cursor-pointer"
          >
            <Star className="h-4 w-4" fill={image.is_primary ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            disabled={busy || index === 0}
            onClick={() => onMove(-1)}
            aria-label="Move image earlier"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#45483F] transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-30 dark:text-[#A1A1AA] dark:hover:bg-white/10 cursor-pointer"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={busy || index === total - 1}
            onClick={() => onMove(1)}
            aria-label="Move image later"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#45483F] transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-30 dark:text-[#A1A1AA] dark:hover:bg-white/10 cursor-pointer"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete()}
          aria-label="Delete image"
          title="Delete image"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#45483F] transition-colors hover:bg-white/70 dark:text-[#A1A1AA] dark:hover:bg-white/10 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function AdminServiceEditorPage() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const toast = useAdminToast()
  const fileRef = useRef(null)

  const [loading, setLoading] = useState(!isNew)
  const [loadError, setLoadError] = useState('')
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageBusy, setImageBusy] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    pricing_type: 'fixed',
    price: '',
    pricing_unit: '',
    status: 'published',
    featured: false,
    sort_order: 0,
  })
  const [errors, setErrors] = useState({})
  const [slugTouched, setSlugTouched] = useState(false)
  const [savedFormJson, setSavedFormJson] = useState(null)
  const leavingRef = useRef(false)

  const dirty = savedFormJson !== null && JSON.stringify(form) !== savedFormJson

  useEffect(() => {
    if (!dirty) return undefined
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const confirmLeave = () => {
    if (leavingRef.current) return true
    if (!dirty) return true
    return window.confirm('You have unsaved changes. Leave without saving?')
  }

  const setField = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (key === 'name' && !slugTouched) next.slug = slugify(value)
      return next
    })
  }

  const load = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const categoriesData = await fetchCategories()
      setCategories(categoriesData)
      if (!isNew) {
        const [product, imagesData] = await Promise.all([
          fetchProduct(id),
          fetchProductImages(id),
        ])
        if (!product) throw new Error('Service not found — it may have been removed.')
        const nextForm = {
          name: product.name,
          slug: product.slug,
          category_id: product.category_id ?? '',
          description: product.description ?? '',
          pricing_type: product.pricing_type,
          price: product.price != null ? String(product.price) : '',
          pricing_unit: product.pricing_unit ?? '',
          status: product.status,
          featured: product.featured,
          sort_order: product.sort_order ?? 0,
        }
        setForm(nextForm)
        setSavedFormJson(JSON.stringify(nextForm))
        setImages(imagesData)
      }
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.slug.trim()) next.slug = 'Slug is required'
    if (!form.category_id) next.category_id = 'Choose a category'
    if (form.pricing_type !== 'custom_quote') {
      const price = Number(form.price)
      if (form.price === '' || Number.isNaN(price) || price < 0) {
        next.price = 'Enter a valid price (0 or more)'
      }
    }
    if (form.pricing_type === 'per_unit' && !form.pricing_unit.trim()) {
      next.pricing_unit = 'Unit is required for per-unit pricing'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        category_id: form.category_id,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        pricing_type: form.pricing_type,
        price: form.price,
        pricing_unit: form.pricing_unit,
        status: form.status,
        featured: form.featured,
        sort_order: Number(form.sort_order) || 0,
      }
      if (isNew) {
        const created = await createProduct(payload)
        toast.success(`"${created.name}" created`)
        leavingRef.current = true
        navigate(`/admin/services/${created.id}`, { replace: true })
      } else {
        await updateProduct(id, payload)
        toast.success('Changes saved')
        setSavedFormJson(JSON.stringify(form))
        load()
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const reloadImages = async () => {
    if (isNew) return
    const imagesData = await fetchProductImages(id)
    setImages(imagesData)
  }

  const handleUpload = async (files) => {
    const file = files?.[0]
    if (!file) return
    const validation = {
      ok: ALLOWED_IMAGE_TYPES.includes(file.type),
      size: file.size <= MAX_IMAGE_BYTES,
    }
    if (!validation.ok) {
      toast.error(`Only ${ALLOWED_IMAGE_TYPES.map((t) => t.replace('image/', '.')).join(', ')} files are allowed`)
      return
    }
    if (!validation.size) {
      toast.error('Images must be 5 MB or smaller')
      return
    }
    setUploading(true)
    try {
      await uploadProductImage(id, file)
      toast.success('Image uploaded')
      await reloadImages()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const runImageAction = async (fn, successMsg) => {
    setImageBusy(true)
    try {
      await fn()
      toast.success(successMsg)
      await reloadImages()
    } catch (err) {
      toast.error(err.message)
      try {
        await reloadImages()
      } catch {
        // keep the current view if the refresh itself fails
      }
    } finally {
      setImageBusy(false)
    }
  }

  if (loadError) {
    return (
      <div>
        <AdminPageHeader title="Edit service" />
        <div className="mt-6">
          <AdminErrorState message={loadError} onRetry={load} />
        </div>
        <div className="mt-4">
          <AdminButton variant="outline" onClick={() => navigate('/admin/services')}>
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </AdminButton>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (confirmLeave()) navigate('/admin/services')
        }}
        className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#45483F] transition-colors hover:text-[#3D4D2B] dark:text-[#A1A1AA] dark:hover:text-[#AAB95F] cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to services
      </button>

      <AdminPageHeader
        title={isNew ? 'Add service' : 'Edit service'}
        subtitle={isNew ? undefined : `/${form.slug}`}
        actions={
          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create service' : 'Save changes'}
          </AdminButton>
        }
      />

      {loading ? (
        <AdminLoading label="Loading service…" />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main form */}
          <div className="rounded-[24px] border border-[#C5C8BC]/50 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:border-[#26262B] dark:bg-[#1A1A1E] sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel htmlFor="svc-name" required>
                  Name
                </FieldLabel>
                <AdminInput
                  id="svc-name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="e.g. Custom Brochure Design"
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </div>

              <div>
                <FieldLabel htmlFor="svc-slug" required>
                  Slug
                </FieldLabel>
                <AdminInput
                  id="svc-slug"
                  name="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setField('slug', slugify(e.target.value))
                  }}
                  placeholder="custom-brochure-design"
                />
                {errors.slug && <FieldError>{errors.slug}</FieldError>}
              </div>

              <div>
                <FieldLabel htmlFor="svc-category" required>
                  Category
                </FieldLabel>
                <AdminSelect
                  id="svc-category"
                  name="category_id"
                  value={form.category_id}
                  onChange={(e) => setField('category_id', e.target.value)}
                >
                  <option value="">Choose a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </AdminSelect>
                {errors.category_id && <FieldError>{errors.category_id}</FieldError>}
              </div>

              <div className="sm:col-span-2">
                <FieldLabel htmlFor="svc-description">Description</FieldLabel>
                <AdminTextarea
                  id="svc-description"
                  name="description"
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  rows={4}
                  placeholder="What does this service include?"
                />
              </div>

              <div>
                <FieldLabel htmlFor="svc-price-type" required>
                  Pricing type
                </FieldLabel>
                <AdminSelect
                  id="svc-price-type"
                  name="pricing_type"
                  value={form.pricing_type}
                  onChange={(e) => setField('pricing_type', e.target.value)}
                >
                  {PRICING_TYPES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </AdminSelect>
              </div>

              {form.pricing_type !== 'custom_quote' && (
                <div>
                  <FieldLabel htmlFor="svc-price" required>
                    Price (₦)
                  </FieldLabel>
                  <AdminInput
                    id="svc-price"
                    name="price"
                    type="number"
                    min="0"
                    step="any"
                    value={form.price}
                    onChange={(e) => setField('price', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.price && <FieldError>{errors.price}</FieldError>}
                </div>
              )}

              {form.pricing_type === 'per_unit' && (
                <div>
                  <FieldLabel htmlFor="svc-unit" required>
                    Unit
                  </FieldLabel>
                  <AdminInput
                    id="svc-unit"
                    name="pricing_unit"
                    value={form.pricing_unit}
                    onChange={(e) => setField('pricing_unit', e.target.value)}
                    placeholder="e.g. per page, per piece"
                  />
                  {errors.pricing_unit && <FieldError>{errors.pricing_unit}</FieldError>}
                </div>
              )}

              <div>
                <FieldLabel htmlFor="svc-status">Status</FieldLabel>
                <AdminSelect
                  id="svc-status"
                  name="status"
                  value={form.status}
                  onChange={(e) => setField('status', e.target.value)}
                >
                  <option value="published">Published (visible on website)</option>
                  <option value="hidden">Hidden (archived)</option>
                </AdminSelect>
              </div>

              <div>
                <FieldLabel htmlFor="svc-sort">Sort order</FieldLabel>
                <AdminInput
                  id="svc-sort"
                  name="sort_order"
                  type="number"
                  step="1"
                  value={form.sort_order}
                  onChange={(e) => setField('sort_order', e.target.value)}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setField('featured', e.target.checked)}
                  className="h-4 w-4 accent-[#3D4D2B] dark:accent-[#AAB95F]"
                />
                <span className="text-[13px] font-medium text-[#1A1C1C] dark:text-[#F2F2F1]">
                  Featured service
                </span>
              </label>
            </div>
          </div>

          {/* Images */}
          {!isNew && (
            <div className="rounded-[24px] border border-[#C5C8BC]/50 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:border-[#26262B] dark:bg-[#1A1A1E] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">
                  Images
                </h2>
                <span className="text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]">
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </span>
              </div>

              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#C5C8BC]/70 px-4 py-8 text-center transition-colors hover:border-[#3D4D2B] disabled:opacity-50 dark:border-[#26262B] dark:hover:border-[#AAB95F] cursor-pointer"
              >
                <Upload className="h-5 w-5 text-[#45483F] dark:text-[#A1A1AA]" />
                <span className="text-[13px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
                  {uploading ? 'Uploading…' : 'Upload image'}
                </span>
                <span className="text-[11px] font-normal text-[#666666] dark:text-[#A1A1AA]">
                  JPG, PNG or WebP · up to 5 MB
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />

              <div className="mt-5 flex flex-col gap-4">
                {images.length === 0 ? (
                  <p className="text-[12px] font-normal leading-[18px] text-[#666666] dark:text-[#A1A1AA]">
                    No images yet. The first image you upload becomes the primary
                    thumbnail on the public site.
                  </p>
                ) : (
                  images.map((image, index) => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      index={index}
                      total={images.length}
                      busy={imageBusy}
                      onSetPrimary={() =>
                        runImageAction(
                          () => setPrimaryImage(id, image.id),
                          'Primary image updated',
                        )
                      }
                      onMove={(dir) =>
                        runImageAction(async () => {
                          const next = [...images]
                          const target = index + dir
                          ;[next[index], next[target]] = [next[target], next[index]]
                          setImages(next)
                          await reorderProductImages(
                            id,
                            next.map((img) => img.id),
                          )
                        }, 'Images reordered')
                      }
                      onDelete={() => setDeleteTarget(image)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete image?"
        message="The image file will be removed from storage and the website. This cannot be undone."
        confirmLabel="Delete image"
        busy={imageBusy}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget || imageBusy) return
          await runImageAction(
            () => deleteProductImage(id, deleteTarget),
            'Image deleted',
          )
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}