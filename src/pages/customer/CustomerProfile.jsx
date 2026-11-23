import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCustomerError, updateCustomerProfile, uploadProfilePhoto } from '@/store/slices/customerSlice';
import { updateLocalUser } from '@/store/slices/authSlice';
import {
  HiOutlineArrowLeft,
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineExclamationCircle,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineX,
} from 'react-icons/hi';

const fieldWithIconClassName =
  'w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-950';

const simpleFieldClassName =
  'w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-950';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error: profileError } = useAppSelector((state) => state.customer);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });

  const [addresses, setAddresses] = useState(
    user?.addresses?.length ? JSON.parse(JSON.stringify(user.addresses)) : []
  );
  const [paymentMethods, setPaymentMethods] = useState(
    user?.paymentMethods?.length ? JSON.parse(JSON.stringify(user.paymentMethods)) : []
  );

  const [notice, setNotice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const displayName = formData.fullName.trim() || user?.email?.split('@')[0] || 'Customer';

  const completionItems = useMemo(
    () => [
      { label: 'Add your full name', complete: Boolean(formData.fullName.trim()) },
      { label: 'Add a phone number', complete: Boolean(formData.phone.trim()) },
      { label: 'Upload a profile photo', complete: Boolean(user?.avatar?.url) },
      {
        label: 'Save a delivery address',
        complete: addresses.length > 0 && Boolean(addresses.some((a) => a.street?.trim() && a.city?.trim())),
      },
    ],
    [formData.fullName, formData.phone, addresses, user?.avatar?.url]
  );

  const completedCount = completionItems.filter((item) => item.complete).length;
  const completion = Math.round((completedCount / completionItems.length) * 100);

  const handleChange = (e) => {
    setFormData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
    setNotice(null);
  };

  // --- Address Handlers ---
  const handleAddressChange = (index, field, value) => {
    setAddresses((curr) => {
      const next = [...curr];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setNotice(null);
  };

  const addAddress = () => {
    setAddresses((curr) => [
      ...curr,
      { street: '', city: '', zip: '', isDefault: curr.length === 0 },
    ]);
    setNotice(null);
  };

  const removeAddress = (index) => {
    setAddresses((curr) => curr.filter((_, i) => i !== index));
    setNotice(null);
  };

  // --- Payment Method Handlers ---
  const handlePaymentChange = (index, field, value) => {
    setPaymentMethods((curr) => {
      const next = [...curr];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setNotice(null);
  };

  const addPayment = () => {
    setPaymentMethods((curr) => [
      ...curr,
      { cardBrand: '', last4: '', isDefault: curr.length === 0 },
    ]);
    setNotice(null);
  };

  const removePayment = (index) => {
    setPaymentMethods((curr) => curr.filter((_, i) => i !== index));
    setNotice(null);
  };

  // --- Photo Upload Handler ---
  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotice({ type: 'error', text: 'Choose a JPG, PNG or WebP image.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'Profile photo must be smaller than 5 MB.' });
      return;
    }

    setIsUploadingPhoto(true);
    setNotice(null);
    const result = await dispatch(uploadProfilePhoto(file));
    setIsUploadingPhoto(false);

    if (uploadProfilePhoto.fulfilled.match(result)) {
      dispatch(updateLocalUser(result.payload));
      setNotice({ type: 'success', text: 'Profile photo updated successfully.' });
    } else {
      setNotice({ type: 'error', text: result.payload || 'Could not upload your profile photo.' });
    }
  };

  // --- Save Profile Handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Filter out completely blank address / payment entries
    const cleanedAddresses = addresses
      .map((a) => ({
        street: a.street?.trim() || '',
        city: a.city?.trim() || '',
        zip: a.zip?.trim() || '',
        isDefault: Boolean(a.isDefault),
      }))
      .filter((a) => a.street || a.city || a.zip);

    const cleanedPayments = paymentMethods
      .map((p) => ({
        cardBrand: p.cardBrand?.trim() || '',
        last4: p.last4?.trim() || '',
        isDefault: Boolean(p.isDefault),
      }))
      .filter((p) => p.cardBrand || p.last4);

    setIsSaving(true);
    setNotice(null);

    const result = await dispatch(
      updateCustomerProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addresses: cleanedAddresses,
        paymentMethods: cleanedPayments,
      })
    );

    setIsSaving(false);

    if (updateCustomerProfile.fulfilled.match(result)) {
      dispatch(updateLocalUser(result.payload));
      setAddresses(cleanedAddresses);
      setPaymentMethods(cleanedPayments);
      setNotice({ type: 'success', text: 'Your customer profile is up to date.' });
    } else {
      setNotice({ type: 'error', text: result.payload || 'Could not save your profile. Please try again.' });
    }
  };

  return (
    <div className="mx-auto max-w-6xl animate-fade-in pb-6">
      {/* Top Bar Header */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
          >
            <HiOutlineArrowLeft className="h-4 w-4" /> Back to workspace
          </button>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your customer profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information, saved addresses, and payment methods.
          </p>
        </div>
        <button
          type="submit"
          form="customer-profile-form"
          disabled={loading || isSaving || isUploadingPhoto}
          className="gradient-primary hidden items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:inline-flex"
        >
          {isSaving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <HiOutlineCheckCircle className="h-5 w-5" />
              Save changes
            </>
          )}
        </button>
      </div>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#171d3c] px-6 py-7 text-white shadow-[0_22px_55px_rgba(43,48,112,.2)] sm:px-8 sm:py-8">
        <div className="absolute -right-16 -top-32 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-36 left-[38%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {/* Avatar with Camera Overlay */}
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-3xl font-bold shadow-2xl ring-4 ring-white/10 sm:h-28 sm:w-28">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span>{displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <label
                className="absolute bottom-0 right-0 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-[#171d3c] bg-primary-600 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-700"
                title="Change profile photo"
              >
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhoto}
                />
                {isUploadingPhoto ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                ) : (
                  <HiOutlineCamera className="h-5 w-5" />
                )}
              </label>
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-indigo-200">Customer profile</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-200">
                  <HiOutlineShieldCheck className="h-3.5 w-3.5" /> Verified customer
                </span>
              </div>
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-indigo-100/70">
                <HiOutlineMail className="h-4 w-4" />
                {user?.email}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-indigo-100/80">
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineHome className="h-4 w-4 text-amber-300" />
                  <strong className="text-white">{addresses.length}</strong>{' '}
                  {addresses.length === 1 ? 'saved address' : 'saved addresses'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineCreditCard className="h-4 w-4 text-indigo-200" />
                  <strong className="text-white">{paymentMethods.length}</strong>{' '}
                  {paymentMethods.length === 1 ? 'payment method' : 'payment methods'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HiOutlineSparkles className="h-4 w-4 text-emerald-300" />
                  Active member
                </span>
              </div>
            </div>
          </div>

          {/* Profile Strength Card */}
          <div className="w-full rounded-2xl border border-white/10 bg-white/[.07] p-4 backdrop-blur-sm lg:w-[270px]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-indigo-200">Profile strength</p>
                <p className="mt-1 text-sm font-semibold">
                  {completion === 100 ? 'All details set' : 'Complete your profile'}
                </p>
              </div>
              <span className="text-2xl font-bold">{completion}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] leading-4 text-indigo-100/65">
              A complete profile helps service professionals coordinate and deliver with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Banner Notice */}
      {(notice || profileError) && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            notice?.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'
          }`}
        >
          {notice?.type === 'success' ? (
            <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <HiOutlineExclamationCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <span className="flex-1 font-medium">{notice?.text || profileError}</span>
          <button
            type="button"
            onClick={() => {
              setNotice(null);
              dispatch(clearCustomerError());
            }}
            aria-label="Dismiss message"
            className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"
          >
            <HiOutlineX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Profile Form */}
      <form id="customer-profile-form" onSubmit={handleSubmit} className="mt-6">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Main 2-Col Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Card 1: Personal Information */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-7">
              <div className="mb-6 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <HiOutlineUser className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Personal information</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Keep your contact details accurate for project communications and service bookings.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full name
                  </span>
                  <span className="relative block">
                    <HiOutlineUser className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Your full name"
                      className={fieldWithIconClassName}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone number
                  </span>
                  <span className="relative block">
                    <HiOutlinePhone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="Your contact number"
                      className={fieldWithIconClassName}
                    />
                  </span>
                </label>
              </div>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                  <HiOutlineShieldCheck className="mr-1.5 inline h-4 w-4 text-emerald-500" />
                  Your phone number is kept confidential and only shared with verified professionals when you hire them.
                </p>
              </div>
            </section>

            {/* Card 2: Saved Addresses */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-7">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
                    <HiOutlineHome className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">Saved addresses</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Locations where you want your home and local services delivered.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addAddress}
                  className="inline-flex items-center gap-1.5 self-start rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
                >
                  <HiOutlinePlus className="h-4 w-4" /> Add address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center dark:border-slate-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <HiOutlineLocationMarker className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No saved addresses yet
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Add your home, office or rental addresses for quick one-click service bookings.
                  </p>
                  <button
                    type="button"
                    onClick={addAddress}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <HiOutlinePlus className="h-3.5 w-3.5" /> Add your first address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <HiOutlineLocationMarker className="h-3.5 w-3.5 text-indigo-500" />
                          Address #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAddress(idx)}
                          className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          title="Remove address"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-1">
                          <label className="mb-1.5 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={addr.street || ''}
                            onChange={(e) => handleAddressChange(idx, 'street', e.target.value)}
                            placeholder="e.g. 123 Main St, Apt 4B"
                            className={simpleFieldClassName}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            City
                          </label>
                          <input
                            type="text"
                            value={addr.city || ''}
                            onChange={(e) => handleAddressChange(idx, 'city', e.target.value)}
                            placeholder="e.g. Kolkata"
                            className={simpleFieldClassName}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Zip / Postal Code
                          </label>
                          <input
                            type="text"
                            value={addr.zip || ''}
                            onChange={(e) => handleAddressChange(idx, 'zip', e.target.value)}
                            placeholder="e.g. 700016"
                            className={simpleFieldClassName}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Card 3: Payment Methods */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-7">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <HiOutlineCreditCard className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">Payment methods</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Cards and payment preferences for seamless checkout and milestones.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPayment}
                  className="inline-flex items-center gap-1.5 self-start rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
                >
                  <HiOutlinePlus className="h-4 w-4" /> Add card
                </button>
              </div>

              {paymentMethods.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center dark:border-slate-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <HiOutlineCreditCard className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No payment methods saved
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Save a card for instant booking escrow and automatic milestone releases.
                  </p>
                  <button
                    type="button"
                    onClick={addPayment}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <HiOutlinePlus className="h-3.5 w-3.5" /> Add your first card
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((pay, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <HiOutlineCreditCard className="h-3.5 w-3.5 text-indigo-500" />
                          Card #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePayment(idx)}
                          className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          title="Remove card"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Card Brand
                          </label>
                          <input
                            type="text"
                            value={pay.cardBrand || ''}
                            onChange={(e) => handlePaymentChange(idx, 'cardBrand', e.target.value)}
                            placeholder="e.g. Visa, Mastercard, RuPay"
                            className={simpleFieldClassName}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Last 4 Digits
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={pay.last4 || ''}
                            onChange={(e) => handlePaymentChange(idx, 'last4', e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 4242"
                            className={simpleFieldClassName}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                  <HiOutlineLockClosed className="mr-1.5 inline h-4 w-4 text-emerald-500" />
                  Payments are encrypted and processed securely via Razorpay. Your full card numbers are never stored on SkillBridge servers.
                </p>
              </div>
            </section>
          </div>

          {/* Right Sidebar Column */}
          <aside className="space-y-6 lg:sticky lg:top-[100px] lg:col-span-1">
            {/* Checklist Card */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-indigo-500">
                    Profile checklist
                  </p>
                  <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {completedCount} of {completionItems.length} complete
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200">
                  {completion}%
                </div>
              </div>
              <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-3">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        item.complete
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}
                    >
                      {item.complete ? (
                        <HiOutlineCheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={`text-xs ${
                        item.complete ? 'font-medium text-slate-700 dark:text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Assurance Guarantee Card */}
            <section className="overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 dark:border-indigo-900/70 dark:from-indigo-950/40 dark:to-violet-950/30">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-soft dark:bg-slate-900 dark:text-indigo-300">
                <HiOutlineShieldCheck className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-bold text-slate-900 dark:text-white">SkillBridge Guarantee</h2>
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                Every booking on SkillBridge includes verified professionals, milestone tracking, and platform dispute protection.
              </p>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Satisfaction Protected</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  100%
                </span>
              </div>
            </section>

            {/* Support Card */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
                  <HiOutlineSparkles className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                  24/7 Support
                </span>
              </div>
              <h2 className="mt-4 font-bold text-slate-900 dark:text-white">Need assistance?</h2>
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                Have questions about booking a service or managing your customer profile? Reach out to support anytime.
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] leading-4 text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                Email support@skillbridge.com or message through your dashboard.
              </div>
            </section>
          </aside>
        </div>

        {/* Sticky Bottom Save Bar */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-soft dark:border-slate-700 dark:bg-surface-900 sm:flex-row sm:items-center sm:justify-between sm:pl-5">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Keep your profile current</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Changes will take effect immediately across all your bookings.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || isSaving || isUploadingPhoto}
            className="gradient-primary inline-flex min-w-36 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <HiOutlineCheckCircle className="h-5 w-5" />
                Save profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;
