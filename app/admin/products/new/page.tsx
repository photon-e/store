import { ProductForm } from '@/components/admin/ProductForm';
import { requireAdminPage } from '@/lib/requireAdmin';

export default async function NewProductPage() {
  await requireAdminPage();
  return <div className="container-page py-10"><ProductForm /></div>;
}
