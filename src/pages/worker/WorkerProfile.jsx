import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCustomerError, updateCustomerProfile, uploadProfilePhoto } from '@/store/slices/customerSlice';
import { updateLocalUser } from '@/store/slices/authSlice';
import {
  HiOutlineArrowLeft,
  HiOutlineBadgeCheck,
  HiOutlineBriefcase,
  HiOutlineCamera,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineCurrencyRupee,
  HiOutlineDeviceMobile,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineLibrary,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineQrcode,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineStar,
  HiOutlineUser,
  HiOutlineX,
} from 'react-icons/hi';

const fieldClassName = 'w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-950';

const WorkerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error: profileError } = useAppSelector((state) => state.customer);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillDraft, setSkillDraft] = useState('');
  const [payoutDetails, setPayoutDetails] = useState({
    accountHolderName: user?.payoutDetails?.accountHolderName || '',
    bankName: user?.payoutDetails?.bankName || '',
    accountNumber: user?.payoutDetails?.accountNumber || '',
    ifscCode: user?.payoutDetails?.ifscCode || '',
    upiId: user?.payoutDetails?.upiId || '',
  });
  const [notice, setNotice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const displayName = formData.fullName.trim() || user?.email?.split('@')[0] || 'SkillBridge professional';
  const rating = Number(user?.averageRating || 0).toFixed(1);
  const reviewCount = Number(user?.totalReviews || 0);
  const verificationStatus = user?.verificationStatus || 'None';
  const isVerified = verificationStatus === 'Verified';
  const verificationLabel = {
    Verified: 'Verified professional',
    Pending: 'Verification pending',
    Rejected: 'Verification needs attention',
    None: 'Not verified',
  }[verificationStatus] || 'Not verified';

  const hasPayoutConfigured = Boolean(
    payoutDetails.upiId?.trim() ||
    (payoutDetails.accountNumber?.trim() && payoutDetails.ifscCode?.trim())
  );

  const completionItems = useMemo(() => ([
    { label: 'Add your full name', complete: Boolean(formData.fullName.trim()) },
    { label: 'Add a phone number', complete: Boolean(formData.phone.trim()) },
    { label: 'Upload a profile photo', complete: Boolean(user?.avatar?.url) },
    { label: 'Show your professional skills', complete: skills.length > 0 },
    { label: 'Link Bank Account or UPI for payouts', complete: hasPayoutConfigured },
  ]), [formData.fullName, formData.phone, skills.length, user?.avatar?.url, hasPayoutConfigured]);
  const completedCount = completionItems.filter((item) => item.complete).length;
  const completion = Math.round((completedCount / completionItems.length) * 100);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setNotice(null);
  };

  const handlePayoutChange = (field, value) => {
    setPayoutDetails((current) => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const addSkills = (rawValue) => {
    const newSkills = rawValue.split(',').map((skill) => skill.trim()).filter(Boolean);
    if (!newSkills.length) return;
    setSkills((current) => {
      const next = [...current];
      newSkills.forEach((skill) => {
        if (next.length < 12 && !next.some((item) => item.toLowerCase() === skill.toLowerCase())) next.push(skill);
      });
      return next;
    });
    setSkillDraft('');
    setNotice(null);
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addSkills(skillDraft);
    }
    if (event.key === 'Backspace' && !skillDraft && skills.length) setSkills((current) => current.slice(0, -1));
  };

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
      setNotice({ type: 'success', text: 'Profile photo updated.' });
    } else {
      setNotice({ type: 'error', text: result.payload || 'Could not upload your profile photo.' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedSkills = [...skills];
    skillDraft.split(',').map((skill) => skill.trim()).filter(Boolean).forEach((skill) => {
      if (normalizedSkills.length < 12 && !normalizedSkills.some((item) => item.toLowerCase() === skill.toLowerCase())) normalizedSkills.push(skill);
    });

    setIsSaving(true);
    setNotice(null);
    const result = await dispatch(updateCustomerProfile({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      skills: normalizedSkills,
      payoutDetails: {
        accountHolderName: payoutDetails.accountHolderName.trim(),
        bankName: payoutDetails.bankName.trim(),
        accountNumber: payoutDetails.accountNumber.trim(),
        ifscCode: payoutDetails.ifscCode.trim().toUpperCase(),
        upiId: payoutDetails.upiId.trim(),
      },
    }));
    setIsSaving(false);
    if (updateCustomerProfile.fulfilled.match(result)) {
      setSkills(normalizedSkills);
      setSkillDraft('');
      dispatch(updateLocalUser(result.payload));
      setNotice({ type: 'success', text: 'Your professional profile and payout details have been saved.' });
    } else {
      setNotice({ type: 'error', text: result.payload || 'Could not save your profile. Please try again.' });
    }
  };

  const isPayoutActive = Boolean(
    hasPayoutConfigured ||
    user?.payoutStatus === 'Active' ||
    user?.payoutDetails?.accountNumber ||
    user?.payoutDetails?.upiId
  );

  return (
    <div className="mx-auto max-w-6xl animate-fade-in pb-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300">
            <HiOutlineArrowLeft className="h-4 w-4" /> Back to workspace
          </button>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your professional profile</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Present your experience, manage payment payouts, and build trust with customers.</p>
        </div>
        <button type="submit" form="worker-profile-form" disabled={loading || isSaving || isUploadingPhoto} className="gradient-primary hidden items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:inline-flex">
          {isSaving ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Saving...</> : <><HiOutlineCheckCircle className="h-5 w-5" />Save changes</>}
        </button>
      </div>

      <section className="relative overflow-hidden rounded-[28px] bg-[#171d3c] px-6 py-7 text-white shadow-[0_22px_55px_rgba(43,48,112,.2)] sm:px-8 sm:py-8">
        <div className="absolute -right-16 -top-32 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute -bottom-36 left-[38%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-3xl font-bold shadow-2xl ring-4 ring-white/10 sm:h-28 sm:w-28">
                {user?.avatar?.url ? <img src={user.avatar.url} alt={displayName} className="h-full w-full object-cover" /> : <span>{displayName.charAt(0).toUpperCase()}</span>}
              </div>
              <label className="absolute bottom-0 right-0 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-[#171d3c] bg-primary-600 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-700" title="Change profile photo">
                <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
                {isUploadingPhoto ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" /> : <HiOutlineCamera className="h-5 w-5" />}
              </label>
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-indigo-200">Professional profile</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${isVerified ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-200' : 'border-white/15 bg-white/[.08] text-indigo-100'}`}>
                  <HiOutlineShieldCheck className="h-3.5 w-3.5" /> {verificationLabel}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${isPayoutActive ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-200' : 'border-amber-300/30 bg-amber-400/15 text-amber-200'}`}>
                  <HiOutlineCash className="h-3.5 w-3.5" /> {isPayoutActive ? 'Payouts Active' : 'Payouts Incomplete'}
                </span>
              </div>
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-indigo-100/70"><HiOutlineMail className="h-4 w-4" />{user?.email}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-indigo-100/80">
                <span className="inline-flex items-center gap-1.5"><HiOutlineStar className="h-4 w-4 text-amber-300" /><strong className="text-white">{rating}</strong> rating</span>
                <span className="inline-flex items-center gap-1.5"><HiOutlineBadgeCheck className="h-4 w-4 text-indigo-200" />{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
                <span className="inline-flex items-center gap-1.5"><HiOutlineEye className="h-4 w-4 text-emerald-300" />Visible to customers</span>
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/10 bg-white/[.07] p-4 backdrop-blur-sm lg:w-[270px]">
            <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-indigo-200">Profile strength</p><p className="mt-1 text-sm font-semibold">{completion === 100 ? 'Ready to stand out' : 'Complete your profile'}</p></div><span className="text-2xl font-bold">{completion}%</span></div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300 transition-all duration-500" style={{ width: `${completion}%` }} /></div>
            <p className="mt-3 text-[11px] leading-4 text-indigo-100/65">A complete profile and linked bank/UPI account ensures fast earnings settlement.</p>
          </div>
        </div>
      </section>

      {(notice || profileError) && (
        <div className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${notice?.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200' : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'}`}>
          {notice?.type === 'success' ? <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0" /> : <HiOutlineExclamationCircle className="mt-0.5 h-5 w-5 shrink-0" />}
          <span className="flex-1 font-medium">{notice?.text || profileError}</span>
          <button type="button" onClick={() => { setNotice(null); dispatch(clearCustomerError()); }} aria-label="Dismiss message" className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100"><HiOutlineX className="h-4 w-4" /></button>
        </div>
      )}

      <form id="worker-profile-form" onSubmit={handleSubmit} className="mt-6">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Personal information */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-7">
              <div className="mb-6 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"><HiOutlineUser className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Personal information</h2><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Keep your contact details accurate for active projects.</p></div></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">Full name</span><span className="relative block"><HiOutlineUser className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="fullName" value={formData.fullName} onChange={handleChange} autoComplete="name" placeholder="Your full name" className={fieldClassName} /></span></label>
                <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">Phone number</span><span className="relative block"><HiOutlinePhone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" inputMode="tel" placeholder="Your contact number" className={fieldClassName} /></span></label>
              </div>
              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40"><p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400"><HiOutlineShieldCheck className="mr-1.5 inline h-4 w-4 text-emerald-500" />Your phone number is kept private and used for account and project coordination.</p></div>
            </section>

            {/* Professional skills */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-7">
              <div className="mb-6 flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300"><HiOutlineBriefcase className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900 dark:text-white">Professional skills</h2><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Add the services customers can hire you for.</p></div></div>
              <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">Add a skill</span><span className="relative flex rounded-xl border border-slate-200 bg-slate-50/70 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/60 dark:focus-within:border-indigo-500 dark:focus-within:bg-slate-900 dark:focus-within:ring-indigo-950"><HiOutlinePlus className="ml-4 mt-3.5 h-4 w-4 shrink-0 text-slate-400" /><input value={skillDraft} onChange={(event) => setSkillDraft(event.target.value)} onKeyDown={handleSkillKeyDown} onBlur={() => addSkills(skillDraft)} placeholder="e.g. House cleaning, Plumbing, Web design" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white" /><span className="mr-3 mt-3 text-[10px] font-medium text-slate-400">Enter to add</span></span></label>
              <div className="mt-4 flex min-h-12 flex-wrap content-start gap-2">
                {skills.length ? skills.map((skill) => <span key={skill} className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-200">{skill}<button type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))} aria-label={`Remove ${skill}`} className="rounded-full p-0.5 text-indigo-400 transition hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900"><HiOutlineX className="h-3.5 w-3.5" /></button></span>) : <div className="flex w-full items-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400 dark:border-slate-700"><HiOutlineSparkles className="h-4 w-4" />Your skills will appear here.</div>}
              </div>
              <p className="mt-3 text-[11px] text-slate-400">Add up to 12 skills. Separate multiple skills with commas.</p>
            </section>

            {/* Payout Details (Payment Options for Worker) */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900 sm:p-7">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <HiOutlineCurrencyRupee className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-bold text-slate-900 dark:text-white">Bank Account & UPI Payouts</h2>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isPayoutActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}>
                        {isPayoutActive ? 'Active & Ready' : 'Setup Required'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Configure your payout method to receive contract earnings directly to your bank account or UPI after customer approval.
                    </p>
                  </div>
                </div>
              </div>

              {/* UPI Option */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/20">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    <HiOutlineDeviceMobile className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Instant Payout via UPI ID
                  </span>
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    Fastest
                  </span>
                </div>
                <label className="block">
                  <span className="relative block">
                    <HiOutlineQrcode className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="upiId"
                      value={payoutDetails.upiId}
                      onChange={(e) => handlePayoutChange('upiId', e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                      className={fieldClassName}
                    />
                  </span>
                </label>
                <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  Compatible with Google Pay, PhonePe, Paytm, BHIM, or any bank UPI handle.
                </p>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-surface-900">
                  OR DIRECT BANK ACCOUNT (IMPS/NEFT)
                </span>
              </div>

              {/* Bank Transfer Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Account Holder Name
                  </span>
                  <span className="relative block">
                    <HiOutlineUser className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="accountHolderName"
                      value={payoutDetails.accountHolderName}
                      onChange={(e) => handlePayoutChange('accountHolderName', e.target.value)}
                      placeholder="As per bank passbook"
                      className={fieldClassName}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Bank Name
                  </span>
                  <span className="relative block">
                    <HiOutlineLibrary className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="bankName"
                      value={payoutDetails.bankName}
                      onChange={(e) => handlePayoutChange('bankName', e.target.value)}
                      placeholder="e.g. HDFC Bank, SBI, ICICI"
                      className={fieldClassName}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Account Number
                  </span>
                  <span className="relative block">
                    <HiOutlineCreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="accountNumber"
                      value={payoutDetails.accountNumber}
                      onChange={(e) => handlePayoutChange('accountNumber', e.target.value)}
                      placeholder="e.g. 123456789012"
                      className={fieldClassName}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    IFSC Code
                  </span>
                  <span className="relative block">
                    <HiOutlineShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="ifscCode"
                      value={payoutDetails.ifscCode}
                      onChange={(e) => handlePayoutChange('ifscCode', e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className={fieldClassName}
                    />
                  </span>
                </label>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-950/40 dark:bg-emerald-950/20">
                <HiOutlineShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs leading-5 text-emerald-900 dark:text-emerald-200">
                  <p className="font-semibold">Protected Escrow Payouts</p>
                  <p className="text-emerald-700 dark:text-emerald-300/80">
                    Customer contract funds are held in secure escrow. Once you finish the job and the customer approves your submission, 95% of the accepted amount is automatically credited to your linked payout account (5% platform fee).
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[100px] lg:col-span-1">
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-indigo-500">Profile checklist</p><h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">{completedCount} of {completionItems.length} complete</h2></div><div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200">{completion}%</div></div>
              <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-3">{completionItems.map((item) => <div key={item.label} className="flex items-center gap-3"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.complete ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>{item.complete ? <HiOutlineCheckCircle className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</span><span className={`text-xs ${item.complete ? 'font-medium text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>{item.label}</span></div>)}</div>
            </section>

            <section className={`overflow-hidden rounded-[24px] border p-5 ${isVerified ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/70 dark:bg-emerald-950/20' : 'border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 dark:border-indigo-900/70 dark:from-indigo-950/40 dark:to-violet-950/30'}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200' : 'bg-white text-indigo-600 shadow-soft dark:bg-slate-900 dark:text-indigo-300'}`}><HiOutlineShieldCheck className="h-5 w-5" /></span>
              <h2 className="mt-4 font-bold text-slate-900 dark:text-white">{isVerified ? 'Identity verified' : 'Build customer trust'}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{isVerified ? 'Your verified badge is visible to customers across SkillBridge.' : 'Identity verification will help customers hire with more confidence.'}</p>
              {!isVerified && <div className="mt-4 flex items-center justify-between rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/60"><span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">ID verification</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">Coming soon</span></div>}
            </section>

            {/* Worker payouts status summary card */}
            <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-surface-900">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"><HiOutlineCash className="h-5 w-5" /></span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${isPayoutActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'}`}>
                  {isPayoutActive ? 'Ready' : 'Setup required'}
                </span>
              </div>
              <h2 className="mt-4 font-bold text-slate-900 dark:text-white">Worker payouts</h2>
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {isPayoutActive
                  ? `Payout destination is active (${payoutDetails.upiId ? `UPI: ${payoutDetails.upiId}` : `${payoutDetails.bankName || 'Bank'}: •••• ${payoutDetails.accountNumber.slice(-4)}`}). Earnings will be transferred here on job completion.`
                  : 'Add your Bank Account or UPI ID on the left to receive payments for completed jobs.'}
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] leading-4 text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                SkillBridge platform fee: 5%. You receive 95% of customer contracts.
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-soft dark:border-slate-700 dark:bg-surface-900 sm:flex-row sm:items-center sm:justify-between sm:pl-5">
          <div><p className="text-sm font-semibold text-slate-800 dark:text-white">Keep your profile current</p><p className="mt-0.5 text-[11px] text-slate-400">Changes and payout details are saved instantly when you click save.</p></div>
          <button type="submit" disabled={loading || isSaving || isUploadingPhoto} className="gradient-primary inline-flex min-w-36 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
            {isSaving ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Saving...</> : <><HiOutlineCheckCircle className="h-5 w-5" />Save profile</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkerProfile;