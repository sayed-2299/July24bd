import { redirect } from 'next/navigation';

export default function LegacyDonorDashboardRedirect() {
  redirect('/donor/dashboard');
  return null;
} 