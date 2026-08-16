import { useEffect, useState } from 'react'
import { Plus, Eye, EyeOff } from 'lucide-react'
import {
  fetchCategories,
  createCategory,
  updateCategory,
} from '../lib/admin-api.js'
import { slugify } from '../lib/format.js'
import { useAdminToast } from './AdminToast.jsx'
import { AdminButton } from './ui/AdminButton.jsx'
import { AdminInput, AdminSelect, AdminTextarea, FieldLabel, FieldError } from './ui/AdminFields.jsx'
import { StatusBadge } from './ui/AdminBadge.jsx'
import {
  AdminLoading,
  AdminEmptyState,
  AdminErrorState,
  AdminPageHeader,
} from './ui/AdminStates.jsx'
import { AdminModal } from './ui/AdminModal.jsx'

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  status: 'published',
  sort_order: 0,
}

function CategoryRow({ category, onEdit, onToggleStatus }) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-[#C5C8BC]/50 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:border-[#26262B] dark:bg-[#1A1A1E] sm:flex-row sm:items-center sm:gap-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[14px] font-semibold leading-[20px] text-[#1A1C1C] dark:text-[#F2F2F1]">
            {category.name}
          </p>
          <StatusBadge status={category.status} />
        </div>
        <p className="mt-0.5 text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]">
          /{category.slug}
          {category.description ? ` · ${category.description}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#E2E2E2]/60 px-3 py-1 text-[12px] font-semibold text-[#45483F] dark:bg-white/10 dark:text-[#A1A1AA]">
          {category.products?.[0]?.count ?? 0} services
        </span>
        <AdminButton variant="outline" size="sm" onClick={() => onEdit(category)}>
          Edit
        </AdminButton>
        <AdminButton
          variant={category.status === 'published' ? 'danger' : 'outline'}
          size="sm"
          onClick={() => onToggleStatus(category)}
        >
          {category.status === 'published' ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Hide
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Show
            </>
          )}
        </AdminButton>
      </div>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const toast = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [categories, setCategories] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [slugTouched, setSlugTouched] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    setLoadError('')
    try {
      setCategories(await fetchCategories())
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

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setSlugTouched(false)
    setModalOpen(true)
  }

  const openEdit = (category) => {
    setEditing(category)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      status: category.status,
      sort_order: category.sort_order ?? 0,
    })
    setErrors({})
    setSlugTouched(true)
    setModalOpen(true)
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.slug.trim()) next.slug = 'Slug is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setBusy(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        status: form.status,
        sort_order: Number(form.sort_order) || 0,
      }
      if (editing) {
        await updateCategory(editing.id, payload)
        toast.success(`"${payload.name}" updated`)
      } else {
        await createCategory(payload)
        toast.success(`Category "${payload.name}" created`)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleToggleStatus = async (category) => {
    const next = category.status === 'published' ? 'hidden' : 'published'
    try {
      await updateCategory(category.id, {
        name: category.name,
        slug: category.slug,
        description: category.description,
        status: next,
        sort_order: category.sort_order ?? 0,
      })
      toast.success(
        next === 'hidden'
          ? `"${category.name}" hidden from the public site`
          : `"${category.name}" is now visible`,
      )
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        subtitle="Group the services catalogue"
        actions={
          <AdminButton onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add category
          </AdminButton>
        }
      />

      <div className="mt-6">
        {loadError ? (
          <AdminErrorState message={loadError} onRetry={load} />
        ) : loading ? (
          <AdminLoading label="Loading categories…" />
        ) : categories.length === 0 ? (
          <AdminEmptyState
            title="No categories yet"
            message="Create your first category to start organising the catalogue."
            action={
              <AdminButton onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add category
              </AdminButton>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={openEdit}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        title={editing ? 'Edit category' : 'Add category'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} disabled={busy}>
              {busy ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
            </AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel htmlFor="cat-name" required>
              Name
            </FieldLabel>
            <AdminInput
              id="cat-name"
              name="name"
              value={form.name}
              onChange={(e) => {
                setForm((f) => {
                  const next = { ...f, name: e.target.value }
                  if (!slugTouched) next.slug = slugify(e.target.value)
                  return next
                })
              }}
              placeholder="e.g. Branding"
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </div>
          <div>
            <FieldLabel htmlFor="cat-slug" required>
              Slug
            </FieldLabel>
            <AdminInput
              id="cat-slug"
              name="slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
              }}
              placeholder="branding"
            />
            {errors.slug && <FieldError>{errors.slug}</FieldError>}
          </div>
          <div>
            <FieldLabel htmlFor="cat-description">Description</FieldLabel>
            <AdminTextarea
              id="cat-description"
              name="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Short description shown under the category"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="cat-status">Status</FieldLabel>
              <AdminSelect
                id="cat-status"
                name="status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </AdminSelect>
            </div>
            <div>
              <FieldLabel htmlFor="cat-sort">Sort order</FieldLabel>
              <AdminInput
                id="cat-sort"
                name="sort_order"
                type="number"
                step="1"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}