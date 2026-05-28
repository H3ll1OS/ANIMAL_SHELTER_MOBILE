import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/constants/premium-theme';
import { AdminWorkspace } from '@/components/AdminWorkspace';
import { ClientWorkspace } from '@/components/ClientWorkspace';
import { DeveloperWorkspace } from '@/components/DeveloperWorkspace';
import { AdminBottomTab, AdminMoreMenuItem, AdminSidebarNavItem, AuthLink, Card, ClientTab, Field, PrimaryButton, RolePill, SecondaryButton, pressableFeedback } from '@/components';
import { demoAccounts, formatAdminCurrency, formatAdminDate, getAdminDonationStatus, getAdminHealthStatusPriority, getDateTimestamp, getDonationTransactionId, getInitials, isPendingAdoptionStatus, makeEuthanasiaForm, makeHealthForm, makePetForm, makeVaccineForm, paymentMethodVisuals, splitFullName } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { ShelterAppProvider } from '@/hooks/useShelterAppContext';
import type { AdminAdoptionFilter, AdminDonationFilter, AdminHealthFilter, AdminHealthStatus, AdminSection, AuthMode, DeveloperSection, DonationStep, PetApplicationFieldKey, PublicSection, RedirectPrompt, RoleView, SpeciesFilter, UploadedDocument } from '@/types/navigation';
import { useShelterStore } from '@/hooks/use-shelter-store';
import type { PaymentMethod, UserRole, UserStatus } from '@/types/shelter';

type ShelterMobileAppProps = {
  initialRoleView?: RoleView;
  initialPublicSection?: PublicSection;
  initialAdminSection?: AdminSection;
  initialDeveloperSection?: DeveloperSection;
  initialAuthMode?: AuthMode;
};

export function ShelterMobileApp({
  initialRoleView = 'public',
  initialPublicSection = 'home',
  initialAdminSection = 'dashboard',
  initialDeveloperSection = 'users',
  initialAuthMode = 'login',
}: ShelterMobileAppProps = {}) {
  const store = useShelterStore();
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const [activeRoleView, setActiveRoleView] = useState<RoleView>(initialRoleView);
  const [activePublicSection, setActivePublicSection] = useState<PublicSection>(initialPublicSection);
  const [activeAdminSection, setActiveAdminSection] = useState<AdminSection>(initialAdminSection);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  const [isAdminMoreMenuOpen, setIsAdminMoreMenuOpen] = useState(false);
  const [activeDeveloperSection, setActiveDeveloperSection] = useState<DeveloperSection>(initialDeveloperSection);
  const [speciesFilter, setSpeciesFilter] = useState<SpeciesFilter>('all');
  const [adminPetSearchTerm, setAdminPetSearchTerm] = useState('');
  const [adminPetStatusFilter, setAdminPetStatusFilter] = useState<'all' | 'Available' | 'Adopted'>('all');
  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);
  const [petDetailsReturnSection, setPetDetailsReturnSection] = useState<Exclude<PublicSection, 'pet-details'>>('home');
  const [loginForm, setLoginForm] = useState({ email: 'dev@shelter.com', password: 'password' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('user@shelter.local');
  const [favoritePetIds, setFavoritePetIds] = useState<string[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('p-luna');
  const [petApplicationUploads, setPetApplicationUploads] = useState<UploadedDocument[]>([]);
  const [petApplicationError, setPetApplicationError] = useState<string | null>(null);
  const [petApplicationFieldErrors, setPetApplicationFieldErrors] = useState<Partial<Record<PetApplicationFieldKey, string>>>({});
  const [isSubmittingPetApplication, setIsSubmittingPetApplication] = useState(false);
  const [isPetApplicationSuccessModalVisible, setIsPetApplicationSuccessModalVisible] = useState(false);
  const [petApplicationForm, setPetApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    household: '',
    message: '',
    documents: '',
  });
  const [selectedAdoptionId, setSelectedAdoptionId] = useState('a-1001');
  const [adminAdoptionFilter, setAdminAdoptionFilter] = useState<AdminAdoptionFilter>('all');
  const [selectedDonationId, setSelectedDonationId] = useState('d-1001');
  const [adminDonationFilter, setAdminDonationFilter] = useState<AdminDonationFilter>('all');
  const [adminDonationSearchTerm, setAdminDonationSearchTerm] = useState('');
  const [adminHealthFilter, setAdminHealthFilter] = useState<AdminHealthFilter>('all');
  const [adminHealthSearchTerm, setAdminHealthSearchTerm] = useState('');
  const [selectedHealthPetId, setSelectedHealthPetId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('u-admin');
  const [activeDonationStep, setActiveDonationStep] = useState<DonationStep>('send');
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [isDonationSuccessModalVisible, setIsDonationSuccessModalVisible] = useState(false);
  const [donationForm, setDonationForm] = useState({
    name: 'Lea',
    lastName: 'Navarro',
    email: 'user@shelter.local',
    state: 'Metro Manila',
    country: 'Philippines',
    zipCode: '1600',
    amount: '1500',
    anonymous: false,
    paymentMethod: 'gcash' as PaymentMethod,
    detailA: '09181231234',
    detailB: '991233',
  });
  const [isPaymentMethodMenuOpen, setIsPaymentMethodMenuOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showPasswordEditor, setShowPasswordEditor] = useState(false);
  const [profileForm, setProfileForm] = useState<{ name: string; email: string; phone: string; address: string; dateOfBirth: string; profileImage?: { uri: string; name?: string | null; mimeType?: string | null } | null }>({ name: '', email: '', phone: '', address: '', dateOfBirth: '', profileImage: null });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', nextPassword: '' });
  const [petForm, setPetForm] = useState(makePetForm());
  const [petEditId, setPetEditId] = useState<string | null>(null);
  const [healthForm, setHealthForm] = useState(makeHealthForm());
  const [healthEditId, setHealthEditId] = useState<string | null>(null);
  const [vaccineForm, setVaccineForm] = useState(makeVaccineForm());
  const [euthanasiaForm, setEuthanasiaForm] = useState(makeEuthanasiaForm());
  const [euthanasiaEditId, setEuthanasiaEditId] = useState<string | null>(null);
  const [userRoleDraft, setUserRoleDraft] = useState<UserRole>('admin');
  const [userStatusDraft, setUserStatusDraft] = useState<UserStatus>('Active');
  const [redirectPrompt, setRedirectPrompt] = useState<RedirectPrompt>(null);
  const adminSidebarTranslateX = useRef(new Animated.Value(36)).current;
  const adminSidebarOpacity = useRef(new Animated.Value(0)).current;
  const noticeOpacity = useRef(new Animated.Value(0)).current;
  const noticeAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const dismissNoticeRef = useRef(store.dismissNotice);

  const currentUser = store.currentUser;
  const storeNotice = store.notice;
  const visibleStoreNotice = isPetApplicationSuccessModalVisible || isDonationSuccessModalVisible ? null : storeNotice;
  const currentUserId = currentUser?.id ?? null;
  const currentUserRole = currentUser?.role ?? null;
  const currentUserName = currentUser?.name ?? '';
  const currentUserEmail = currentUser?.email ?? '';
  const currentUserPhone = currentUser?.phone ?? '';
  const currentUserAddress = currentUser?.address ?? '';
  const currentUserDateOfBirth = currentUser?.dateOfBirth ?? '';
  const isAuthenticated = Boolean(currentUser);
  const isCompactPhone = viewportWidth < 390;
  const isShortScreen = viewportHeight < 860;
  const isTablet = viewportWidth >= 768;
  const isDesktop = viewportWidth >= 1080;
  const useCompactBottomNav = viewportWidth < 360;
  const useRoomyBottomNav = isTablet;
  const contentMaxWidth = isDesktop ? 1280 : isTablet ? 980 : 680;
  const authMaxWidth = isDesktop ? 1120 : isTablet ? 920 : 520;
  const horizontalPadding = isDesktop ? 32 : isTablet ? 24 : isCompactPhone ? 14 : 18;
  const recordWidthStyle: ViewStyle = { width: isDesktop ? 190 : isTablet ? 170 : 150 };
  const canSeeAdmin = currentUser?.role === 'admin' || currentUser?.role === 'developer';
  const canSeeDeveloper = currentUser?.role === 'developer';
  const defaultPetId = store.pets[0]?.id ?? '';
  const requiresRedirectChoice = Boolean(redirectPrompt);
  const showWorkspaceSwitcher = canSeeAdmin || canSeeDeveloper;
  const hasClientBottomNav = activeRoleView === 'public';
  const hasAdminBottomNav = activeRoleView === 'admin';
  const useClientPetGrid = isTablet;
  const useCompactHomePreview = isShortScreen && !isTablet;
  const clientPetCardWidthStyle: ViewStyle = useClientPetGrid ? { width: (isDesktop ? '31.8%' : '48.8%') as ViewStyle['width'], marginRight: 0 } : recordWidthStyle;
  const adoptPetCardWidthStyle: ViewStyle = useClientPetGrid ? clientPetCardWidthStyle : { width: '100%', marginRight: 0 };
  const homePetCardWidthStyle: ViewStyle = isTablet
    ? { width: (isDesktop ? '31.8%' : '48.8%') as ViewStyle['width'], marginRight: 0 }
    : useCompactHomePreview
      ? { width: '100%', marginRight: 0 }
      : { width: Math.min(Math.max(viewportWidth * 0.72, 232), 272) };
  const clientSplitFieldStyle: ViewStyle = { width: (isTablet ? '48.8%' : '100%') as ViewStyle['width'] };
  const clientFullFieldStyle: ViewStyle = { width: '100%' as ViewStyle['width'] };
  const adminOverviewMetricWidthStyle: ViewStyle = isDesktop
    ? { flexBasis: '23.5%' as ViewStyle['width'] }
    : { flexBasis: '47.6%' as ViewStyle['width'] };
  const adminQuickActionWidthStyle: ViewStyle = isDesktop
    ? { flexBasis: '23.5%' as ViewStyle['width'] }
    : isTablet
      ? { flexBasis: '31.8%' as ViewStyle['width'] }
      : { flexBasis: '47.6%' as ViewStyle['width'] };
  const clientBottomNavDockPadding = isTablet ? 10 : isShortScreen ? 6 : 8;
  const adminBottomNavDockPadding = isTablet ? 10 : 8;
  const clientBottomNavHeight = useCompactBottomNav ? 64 : useRoomyBottomNav ? 92 : 88;
  const adminBottomNavHeight = useCompactBottomNav ? 64 : useRoomyBottomNav ? 96 : 92;
  const bottomNavClearance = isTablet ? 24 : 34;
  const bottomContentPadding = hasClientBottomNav
    ? clientBottomNavDockPadding + clientBottomNavHeight + bottomNavClearance
    : hasAdminBottomNav
      ? adminBottomNavDockPadding + adminBottomNavHeight + bottomNavClearance
      : 18;

  useEffect(() => {
    dismissNoticeRef.current = store.dismissNotice;
  }, [store.dismissNotice]);

  useEffect(() => {
    if (!storeNotice) return;

    noticeAnimationRef.current?.stop();
    noticeOpacity.setValue(1);

    const hideTimer = setTimeout(() => {
      const animation = Animated.timing(noticeOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      });

      noticeAnimationRef.current = animation;
      animation.start(({ finished }) => {
        if (finished) {
          dismissNoticeRef.current();
        }
      });
    }, 2600);

    return () => {
      clearTimeout(hideTimer);
      noticeAnimationRef.current?.stop();
    };
  }, [storeNotice, noticeOpacity]);

  useEffect(() => {
    const { firstName, lastName } = splitFullName(currentUserName);
    setPetApplicationForm((current) => ({
      ...current,
      fullName: currentUserName,
      email: currentUserEmail,
      phone: currentUserPhone,
      address: currentUserAddress,
    }));
    setProfileForm({
      name: currentUserName,
      email: currentUserEmail,
      phone: currentUserPhone,
      address: currentUserAddress,
      dateOfBirth: currentUserDateOfBirth,
      profileImage: null,
    });
    setDonationForm((current) => ({
      ...current,
      name: currentUserId ? firstName : '',
      lastName: lastName,
      email: currentUserEmail,
    }));
  }, [currentUserId, currentUserName, currentUserEmail, currentUserPhone, currentUserAddress, currentUserDateOfBirth]);

  useEffect(() => {
    if (activeRoleView === 'admin' && !canSeeAdmin) setActiveRoleView('public');
    if (activeRoleView === 'developer' && !canSeeDeveloper) setActiveRoleView('public');
  }, [activeRoleView, canSeeAdmin, canSeeDeveloper]);

  useEffect(() => {
    if (!currentUserId || !currentUserRole) {
      setRedirectPrompt(null);
      setActiveRoleView('public');
      setActivePublicSection('home');
      setAuthMode('login');
      return;
    }

    if (currentUserRole === 'developer') {
      setRedirectPrompt((current) => (current?.userId === currentUserId ? current : { userId: currentUserId, role: 'developer' }));
      return;
    }

    if (currentUserRole === 'admin') {
      setRedirectPrompt((current) => (current?.userId === currentUserId ? current : { userId: currentUserId, role: 'admin' }));
      return;
    }

    setRedirectPrompt(null);
    setActiveRoleView('public');
    setActivePublicSection('home');
  }, [currentUserId, currentUserRole]);

  useEffect(() => {
    if (!defaultPetId) return;

    setHealthForm((current) => (store.pets.some((pet) => pet.id === current.petId) ? current : makeHealthForm(undefined, defaultPetId)));
    setVaccineForm((current) => (store.pets.some((pet) => pet.id === current.petId) ? current : makeVaccineForm(undefined, defaultPetId)));
    setEuthanasiaForm((current) => (store.pets.some((pet) => pet.id === current.petId) ? current : makeEuthanasiaForm(undefined, defaultPetId)));
  }, [defaultPetId, store.pets]);

  const clientAvailablePets = useMemo(() => store.pets.filter((pet) => pet.status === 'Available'), [store.pets]);
  const filteredPets = useMemo(() => {
    const visiblePets = activeRoleView === 'public' ? clientAvailablePets : store.pets;
    return visiblePets.filter((pet) => speciesFilter === 'all' || pet.species === speciesFilter);
  }, [activeRoleView, clientAvailablePets, speciesFilter, store.pets]);
  const adoptFilteredPets = filteredPets;
  const adoptSpotlightPet = adoptFilteredPets.find((pet) => pet.id === selectedPetId) ?? adoptFilteredPets[0] ?? null;
  const adminPetSearchQuery = adminPetSearchTerm.trim().toLowerCase();
  const adminPetStatusCounts = useMemo(
    () => ({
      all: store.pets.length,
      Available: store.pets.filter((pet) => pet.status === 'Available').length,
      Adopted: store.pets.filter((pet) => pet.status === 'Adopted').length,
    }),
    [store.pets]
  );
  const adminFilteredPets = useMemo(
    () =>
      store.pets.filter((pet) => {
        if (adminPetStatusFilter !== 'all' && pet.status !== adminPetStatusFilter) return false;
        if (!adminPetSearchQuery) return true;

        const haystack = [pet.name, pet.breed, pet.species, pet.gender, pet.size, pet.status, pet.imageLabel].join(' ').toLowerCase();
        return haystack.includes(adminPetSearchQuery);
      }),
    [adminPetSearchQuery, adminPetStatusFilter, store.pets]
  );
  const adminAdoptionCounts = useMemo(
    () => ({
      all: store.adoptions.length,
      pending: store.adoptions.filter((adoption) => isPendingAdoptionStatus(adoption.status)).length,
      approved: store.adoptions.filter((adoption) => adoption.status === 'Approved').length,
      rejected: store.adoptions.filter((adoption) => adoption.status === 'Rejected').length,
    }),
    [store.adoptions]
  );
  const adminSortedAdoptions = useMemo(
    () => [...store.adoptions].sort((left, right) => getDateTimestamp(right.createdAt) - getDateTimestamp(left.createdAt)),
    [store.adoptions]
  );
  const adminFilteredAdoptions = useMemo(
    () =>
      adminSortedAdoptions.filter((adoption) => {
        if (adminAdoptionFilter === 'all') return true;
        if (adminAdoptionFilter === 'pending') return isPendingAdoptionStatus(adoption.status);
        if (adminAdoptionFilter === 'approved') return adoption.status === 'Approved';
        return adoption.status === 'Rejected';
      }),
    [adminAdoptionFilter, adminSortedAdoptions]
  );

  useEffect(() => {
    if (adminFilteredAdoptions.length === 0) return;
    if (!adminFilteredAdoptions.some((adoption) => adoption.id === selectedAdoptionId)) {
      setSelectedAdoptionId(adminFilteredAdoptions[0].id);
    }
  }, [adminFilteredAdoptions, selectedAdoptionId]);
  const adminDonationSearchQuery = adminDonationSearchTerm.trim().toLowerCase();
  const adminDonationCounts = useMemo(
    () => ({
      all: store.donations.length,
      completed: store.donations.filter((donation) => getAdminDonationStatus(donation) === 'Completed').length,
      pending: store.donations.filter((donation) => getAdminDonationStatus(donation) === 'Pending').length,
      failed: store.donations.filter((donation) => getAdminDonationStatus(donation) === 'Failed').length,
    }),
    [store.donations]
  );
  const adminSortedDonations = useMemo(
    () => [...store.donations].sort((left, right) => getDateTimestamp(right.createdAt) - getDateTimestamp(left.createdAt)),
    [store.donations]
  );
  const adminFilteredDonations = useMemo(
    () =>
      adminSortedDonations.filter((donation) => {
        const status = getAdminDonationStatus(donation);
        if (adminDonationFilter === 'completed' && status !== 'Completed') return false;
        if (adminDonationFilter === 'pending' && status !== 'Pending') return false;
        if (adminDonationFilter === 'failed' && status !== 'Failed') return false;
        if (!adminDonationSearchQuery) return true;

        const haystack = [
          donation.anonymous ? 'Anonymous Donor' : `${donation.name} ${donation.lastName}`,
          donation.email,
          donation.notes,
          donation.paymentMethod,
          paymentMethodVisuals[donation.paymentMethod].shortLabel,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(adminDonationSearchQuery);
      }),
    [adminDonationFilter, adminDonationSearchQuery, adminSortedDonations]
  );

  useEffect(() => {
    if (adminFilteredDonations.length === 0) return;
    if (!adminFilteredDonations.some((donation) => donation.id === selectedDonationId)) {
      setSelectedDonationId(adminFilteredDonations[0].id);
    }
  }, [adminFilteredDonations, selectedDonationId]);
  const adminHealthSearchQuery = adminHealthSearchTerm.trim().toLowerCase();
  const adminVisibleVaccineSchedules = useMemo(
    () => store.vaccineSchedules.filter((schedule) => !schedule.deleted),
    [store.vaccineSchedules]
  );
  const adminHealthQueue = useMemo(
    () =>
      store.pets
        .map((pet) => {
          const records = store.healthRecords
            .filter((record) => record.petId === pet.id)
            .sort((left, right) => getDateTimestamp(right.reportedDate) - getDateTimestamp(left.reportedDate));
          const schedules = adminVisibleVaccineSchedules
            .filter((schedule) => schedule.petId === pet.id)
            .sort((left, right) => getDateTimestamp(left.nextDueDate) - getDateTimestamp(right.nextDueDate));
          const logs = store.euthanasiaLogs
            .filter((log) => log.petId === pet.id)
            .sort((left, right) => getDateTimestamp(right.euthanasiaDate) - getDateTimestamp(left.euthanasiaDate));
          const latestRecord = records[0] ?? null;
          const nextDueSchedule = schedules.find((schedule) => !schedule.isCompleted) ?? null;
          const hasCriticalAlert = records.some((record) => record.isCritical) || pet.status === 'Sick';
          const hasCheckupDue = Boolean(nextDueSchedule);
          const hasRecoveredCare = !hasCriticalAlert && (records.length > 0 || schedules.some((schedule) => schedule.isCompleted));
          const shouldInclude = hasCriticalAlert || hasCheckupDue || hasRecoveredCare || logs.length > 0;
          const status: AdminHealthStatus = hasCriticalAlert ? 'Active Alert' : hasCheckupDue ? 'Check-up Due' : 'Recovered';
          const timestamp = latestRecord
            ? getDateTimestamp(latestRecord.reportedDate)
            : nextDueSchedule
              ? getDateTimestamp(nextDueSchedule.nextDueDate)
              : logs[0]
                ? getDateTimestamp(logs[0].euthanasiaDate)
                : getDateTimestamp(pet.dateReceived);

          return {
            pet,
            records,
            schedules,
            logs,
            latestRecord,
            nextDueSchedule,
            hasCriticalAlert,
            status,
            timestamp,
            shouldInclude,
            summary: latestRecord
              ? latestRecord.diagnosis
              : nextDueSchedule
                ? `${nextDueSchedule.vaccineType} follow-up due`
                : logs[0]
                  ? 'Archive on file'
                  : 'Recovered and stable',
            note: latestRecord?.description ?? nextDueSchedule?.notes ?? logs[0]?.notes ?? pet.description,
          };
        })
        .filter((item) => item.shouldInclude)
        .sort((left, right) => {
          const priority = getAdminHealthStatusPriority(left.status) - getAdminHealthStatusPriority(right.status);
          if (priority !== 0) return priority;
          return right.timestamp - left.timestamp;
        }),
    [adminVisibleVaccineSchedules, store.euthanasiaLogs, store.healthRecords, store.pets]
  );
  const adminHealthCounts = useMemo(
    () => ({
      all: adminHealthQueue.length,
      activeAlerts: adminHealthQueue.filter((item) => item.status === 'Active Alert').length,
      checkupsDue: adminHealthQueue.filter((item) => item.status === 'Check-up Due').length,
      recovered: adminHealthQueue.filter((item) => item.status === 'Recovered').length,
    }),
    [adminHealthQueue]
  );
  const adminFilteredHealthQueue = useMemo(
    () =>
      adminHealthQueue.filter((item) => {
        if (adminHealthFilter === 'active-alerts' && item.status !== 'Active Alert') return false;
        if (adminHealthFilter === 'check-ups-due' && item.status !== 'Check-up Due') return false;
        if (adminHealthFilter === 'recovered' && item.status !== 'Recovered') return false;
        if (!adminHealthSearchQuery) return true;

        const haystack = [
          item.pet.name,
          item.pet.breed,
          item.pet.species,
          item.pet.gender,
          item.status,
          item.summary,
          item.note,
          item.latestRecord?.diagnosis,
          item.nextDueSchedule?.vaccineType,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(adminHealthSearchQuery);
      }),
    [adminHealthFilter, adminHealthQueue, adminHealthSearchQuery]
  );
  useEffect(() => {
    if (adminHealthQueue.length === 0) return;
    if (!adminHealthQueue.some((item) => item.pet.id === selectedHealthPetId)) {
      setSelectedHealthPetId(adminHealthQueue[0].pet.id);
    }
  }, [adminHealthQueue, selectedHealthPetId]);
  useEffect(() => {
    if (activeAdminSection === 'donation-details' && store.donations.length === 0) {
      setActiveAdminSection('donations');
    }
  }, [activeAdminSection, store.donations.length]);
  useEffect(() => {
    if (activeAdminSection === 'health-record' && adminHealthQueue.length === 0) {
      setActiveAdminSection('health');
    }
  }, [activeAdminSection, adminHealthQueue.length]);
  useEffect(() => {
    if (!isAdminSidebarOpen) return;

    adminSidebarTranslateX.setValue(36);
    adminSidebarOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(adminSidebarTranslateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(adminSidebarOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [adminSidebarOpacity, adminSidebarTranslateX, isAdminSidebarOpen]);

  const selectedPet = activeRoleView === 'public'
    ? clientAvailablePets.find((pet) => pet.id === selectedPetId) ?? null
    : store.pets.find((pet) => pet.id === selectedPetId) ?? store.pets[0] ?? null;
  const selectedAdoption = adminFilteredAdoptions.find((item) => item.id === selectedAdoptionId) ?? adminFilteredAdoptions[0] ?? null;
  const selectedDonation = store.donations.find((item) => item.id === selectedDonationId) ?? store.donations[0] ?? null;
  const selectedManagedUser = store.users.find((user) => user.id === selectedUserId) ?? store.users[0];
  const selectedAdoptionPet = selectedAdoption ? store.pets.find((pet) => pet.id === selectedAdoption.petId) ?? null : null;
  const selectedAdoptionApplicant = selectedAdoption ? store.users.find((user) => user.id === selectedAdoption.userId) ?? null : null;
  const selectedHealthItem = adminHealthQueue.find((item) => item.pet.id === selectedHealthPetId) ?? adminHealthQueue[0] ?? null;
  const selectedHealthRecords = selectedHealthItem?.records ?? [];
  const selectedHealthSchedules = selectedHealthItem?.schedules ?? [];
  const selectedHealthLogs = selectedHealthItem?.logs ?? [];
  const selectedDonorHistory = selectedDonation
    ? store.donations
      .filter((donation) => donation.email.toLowerCase() === selectedDonation.email.toLowerCase())
      .sort((left, right) => getDateTimestamp(left.createdAt) - getDateTimestamp(right.createdAt))
    : [];
  const selectedDonationDonorSince = selectedDonorHistory[0]?.createdAt ?? selectedDonation?.createdAt ?? null;
  const selectedDonationTransactionId = selectedDonation ? getDonationTransactionId(selectedDonation) : '';
  const selectedHealthLatestRecord = selectedHealthItem?.latestRecord ?? null;
  const selectedHealthNextDueSchedule = selectedHealthItem?.nextDueSchedule ?? null;
  const selectedHealthTargetPetId = selectedHealthItem?.pet.id ?? adminHealthQueue[0]?.pet.id ?? defaultPetId;
  const activeAdminTab = activeAdminSection === 'donation-details'
    ? 'donations'
    : activeAdminSection === 'health-record' || activeAdminSection === 'health'
      ? 'more'
      : activeAdminSection;
  const animateAdminSidebar = (translateX: number, opacity: number, callback?: () => void) => {
    Animated.parallel([
      Animated.timing(adminSidebarTranslateX, {
        toValue: translateX,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(adminSidebarOpacity, {
        toValue: opacity,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => callback?.());
  };
  const openAdminSidebar = () => {
    setIsAdminMoreMenuOpen(false);
    setIsAdminSidebarOpen(true);
  };
  const closeAdminSidebar = (callback?: () => void) => {
    animateAdminSidebar(36, 0, () => {
      setIsAdminSidebarOpen(false);
      callback?.();
    });
  };
  const closeAdminSidebarWithAction = (action: () => void | Promise<void>) => {
    closeAdminSidebar(() => {
      void Promise.resolve(action()).catch(() => undefined);
    });
  };
  const toggleAdminMoreMenu = () => {
    if (isAdminSidebarOpen) {
      closeAdminSidebarWithAction(() => setIsAdminMoreMenuOpen((current) => !current));
      return;
    }

    setIsAdminMoreMenuOpen((current) => !current);
  };
  const navigateAdminSection = (section: Exclude<AdminSection, 'donation-details' | 'health-record'>) => {
    setIsAdminMoreMenuOpen(false);
    if (isAdminSidebarOpen) {
      closeAdminSidebarWithAction(() => setActiveAdminSection(section));
      return;
    }

    setActiveAdminSection(section);
  };
  const openAdminVaccinationSchedule = () => {
    if (!selectedHealthTargetPetId) return;
    setIsAdminMoreMenuOpen(false);
    openAdminHealthRecord(selectedHealthTargetPetId);
    setVaccineForm(makeVaccineForm(undefined, selectedHealthTargetPetId));
  };
  const openAdminEuthanasiaLogs = () => {
    if (!selectedHealthTargetPetId) return;
    setIsAdminMoreMenuOpen(false);
    openAdminHealthRecord(selectedHealthTargetPetId);
    setEuthanasiaForm(makeEuthanasiaForm(undefined, selectedHealthTargetPetId));
  };
  const currentUserAdoptions = currentUser ? store.adoptions.filter((adoption) => adoption.userId === currentUser.id) : [];
  const shelterContact = store.users.find((user) => user.role === 'admin') ?? store.users[0];
  const selectedPetVaccines = selectedPet ? store.vaccineSchedules.filter((schedule) => schedule.petId === selectedPet.id && !schedule.deleted) : [];
  const selectedPetHealthRecords = selectedPet ? store.healthRecords.filter((record) => record.petId === selectedPet.id) : [];
  const homePreviewPets = filteredPets.slice(0, isTablet ? 3 : isShortScreen ? 1 : 2);
  const clientDisplayName = currentUser?.name?.trim().split(/\s+/)[0] ?? 'Friend';
  const adminDisplayName = currentUser?.name?.trim().split(/\s+/)[0] ?? 'Admin';
  const accountInitials = getInitials(currentUser?.name);
  const availablePetsCount = store.pets.filter((pet) => pet.status === 'Available').length;
  const donationAmountValue = Number(donationForm.amount || 0);
  const donationTotalValue = Number(donationAmountValue.toFixed(2));
  const donationPaymentDetails = donationForm.paymentMethod === 'credit_card'
    ? { label: 'Credit Card', note: 'Secure card payment', detailALabel: 'Card Number', detailBLabel: 'CVV', preview: `**** **** **** ${donationForm.detailA.slice(-4) || '7568'}` }
    : donationForm.paymentMethod === 'gcash'
      ? { label: 'GCash', note: 'Mobile wallet transfer', detailALabel: 'Mobile Number', detailBLabel: 'Reference Code', preview: donationForm.detailA || '09xx xxx xxxx' }
      : donationForm.paymentMethod === 'paypal'
        ? { label: 'PayPal', note: 'Fast online checkout', detailALabel: 'PayPal Email', detailBLabel: 'Transaction Code', preview: donationForm.detailA || 'paypal@donor.com' }
        : { label: 'Bank Transfer', note: 'Direct bank deposit', detailALabel: 'Account Number', detailBLabel: 'Transfer Reference', preview: donationForm.detailA || 'Account on file' };
  const donationMethodOptions: { method: PaymentMethod }[] = [
    { method: 'gcash' },
    { method: 'paypal' },
    { method: 'bank_transfer' },
    { method: 'credit_card' },
  ];
  const activeDonationMethodVisual = paymentMethodVisuals[donationForm.paymentMethod];
  const pendingClientApplications = currentUserAdoptions.filter((adoption) => adoption.status === 'Pending').length;
  const approvedClientApplications = currentUserAdoptions.filter((adoption) => adoption.status === 'Approved').length;
  const unreadAdoptions = store.adoptions.filter((adoption) => !adoption.adminSeenAt).length;
  const unreadDonations = store.donations.filter((donation) => !donation.adminSeenAt).length;
  const pendingAdoptionRequests = store.adoptions.filter((adoption) => adoption.status === 'Pending' || adoption.status === 'Pending Review').length;
  const criticalHealthAlerts = store.healthRecords.filter((record) => record.isCritical).length;
  const totalDonationsRaised = store.donations.reduce((total, donation) => total + donation.amount, 0);
  const totalDonationDonors = new Set(store.donations.map((donation) => donation.email.toLowerCase())).size;
  const adminNotificationCount = unreadAdoptions + unreadDonations + criticalHealthAlerts;
  const adminOverviewDateLabel = formatAdminDate(new Date(), { month: 'long', day: 'numeric', year: 'numeric' });
  const adminOverviewMetrics = [
    { label: 'Total Pets', value: String(store.pets.length), icon: 'grid', tint: '#fff0e8', accent: palette.clayDeep },
    { label: 'Adoption Requests', value: String(pendingAdoptionRequests), icon: 'heart', tint: '#fff4eb', accent: palette.rose },
    { label: 'Donations', value: formatAdminCurrency(totalDonationsRaised), icon: 'gift', tint: '#ffe8d4', accent: palette.gold },
    { label: 'Health Alerts', value: String(criticalHealthAlerts), icon: 'activity', tint: '#fff7ed', accent: palette.warning },
  ] as const;
  const adminAdoptionTabs = [
    { key: 'all', label: 'All', count: adminAdoptionCounts.all },
    { key: 'pending', label: 'Pending', count: adminAdoptionCounts.pending },
    { key: 'approved', label: 'Approved', count: adminAdoptionCounts.approved },
    { key: 'rejected', label: 'Rejected', count: adminAdoptionCounts.rejected },
  ] as const;
  const adminDonationTabs = [
    { key: 'all', label: 'All', count: adminDonationCounts.all },
    { key: 'completed', label: 'Completed', count: adminDonationCounts.completed },
    { key: 'pending', label: 'Pending', count: adminDonationCounts.pending },
    { key: 'failed', label: 'Failed', count: adminDonationCounts.failed },
  ] as const;
  const adminDonationMetrics = [
    { key: 'total', label: 'Total Donations', value: formatAdminCurrency(totalDonationsRaised), note: `${store.donations.length} records`, icon: 'gift', tint: '#fff1eb', accent: palette.clayDeep },
    { key: 'donors', label: 'Total Donors', value: String(totalDonationDonors), note: '+12 vs last month', icon: 'users', tint: '#eefbf4', accent: palette.eucalyptus },
    { key: 'pending', label: 'Pending', value: String(adminDonationCounts.pending), note: 'Donations', icon: 'credit-card', tint: '#fff7ed', accent: palette.gold },
    { key: 'completed', label: 'Completed', value: String(adminDonationCounts.completed), note: 'Donations', icon: 'check-circle', tint: '#eff6ff', accent: palette.sky },
  ] as const;
  const adminHealthTabs = [
    { key: 'all', label: 'All', count: adminHealthCounts.all },
    { key: 'active-alerts', label: 'Active Alerts', count: adminHealthCounts.activeAlerts },
    { key: 'check-ups-due', label: 'Check-ups Due', count: adminHealthCounts.checkupsDue },
    { key: 'recovered', label: 'Recovered', count: adminHealthCounts.recovered },
  ] as const;
  const adminHealthMetrics = [
    { key: 'treated', label: 'Total Treated Pets', value: String(adminHealthCounts.all), note: 'Monitored records', icon: 'heart', tint: '#fff1eb', accent: palette.rose },
    { key: 'alerts', label: 'Active Alerts', value: String(adminHealthCounts.activeAlerts), note: adminHealthCounts.activeAlerts > 0 ? `${adminHealthCounts.activeAlerts} critical` : '0 critical', icon: 'alert-triangle', tint: '#fff7ed', accent: palette.warning },
    { key: 'recovered', label: 'Recovered', value: String(adminHealthCounts.recovered), note: adminHealthCounts.recovered > 0 ? 'Stable this week' : 'No recovered cases yet', icon: 'check-circle', tint: '#eefbf4', accent: palette.eucalyptus },
    { key: 'due', label: 'Check-ups Due', value: String(adminHealthCounts.checkupsDue), note: adminHealthCounts.checkupsDue > 0 ? 'Next 7 days' : 'Nothing due soon', icon: 'calendar', tint: '#eff6ff', accent: palette.sky },
  ] as const;
  const adminMenuMainItems = [
    { key: 'dashboard', label: 'Dashboard', description: 'Overview and recent shelter activity', icon: 'home', tint: '#fff1eb', accent: palette.clayDeep, onPress: () => navigateAdminSection('dashboard') },
    { key: 'pets', label: 'Pets', description: 'Manage pet profiles and availability', icon: 'grid', tint: '#fff8eb', accent: palette.gold, onPress: () => navigateAdminSection('pets') },
    { key: 'adoptions', label: 'Adoptions', description: 'Review and process requests', icon: 'heart', tint: '#fff4eb', accent: palette.rose, onPress: () => navigateAdminSection('adoptions') },
    { key: 'donations', label: 'Donations', description: 'Track donor activity and records', icon: 'gift', tint: '#eefbf4', accent: palette.eucalyptus, onPress: () => navigateAdminSection('donations') },
    { key: 'health', label: 'Health Monitoring', description: 'Monitor treatment queue', icon: 'activity', tint: '#fff7ed', accent: palette.warning, onPress: () => navigateAdminSection('health') },
    { key: 'vaccines', label: 'Vaccination Schedule', description: 'Open due check-ups', icon: 'shield', tint: '#eef2ff', accent: palette.sky, onPress: openAdminVaccinationSchedule },
    { key: 'euthanasia', label: 'Euthanasia Logs', description: 'Review archived records', icon: 'file-text', tint: '#fff7ed', accent: palette.clayDeep, onPress: openAdminEuthanasiaLogs },
  ] as const;
  const adminMoreMenuItems = [
    { key: 'health', label: 'Health Monitoring', description: 'Manage pet health records', icon: 'activity', tint: '#fff7ed', accent: palette.warning, onPress: () => navigateAdminSection('health') },
    { key: 'vaccines', label: 'Vaccination Schedule', description: 'Manage vaccination schedule', icon: 'shield', tint: '#eef2ff', accent: palette.sky, onPress: openAdminVaccinationSchedule },
    { key: 'euthanasia', label: 'Euthanasia Logs', description: 'View euthanasia records', icon: 'file-text', tint: '#fff7ed', accent: palette.clayDeep, onPress: openAdminEuthanasiaLogs },
  ] as const;
  const adminQuickActions = [
    {
      label: 'Add New Pet',
      icon: 'grid',
      tint: '#fff0e8',
      accent: palette.clayDeep,
      onPress: () => {
        setPetEditId(null);
        setPetForm(makePetForm());
        setActiveAdminSection('pets');
      },
    },
    {
      label: 'New Adoption',
      icon: 'heart',
      tint: '#fff4eb',
      accent: palette.rose,
      onPress: () => {
        setActiveAdminSection('adoptions');
      },
    },
    {
      label: 'Health Record',
      icon: 'activity',
      tint: '#fff7ed',
      accent: palette.warning,
      onPress: () => {
        setHealthEditId(null);
        setHealthForm(makeHealthForm(undefined, defaultPetId));
        setActiveAdminSection('health');
      },
    },
    {
      label: 'Add Donation',
      icon: 'briefcase',
      tint: '#ffe8d4',
      accent: palette.gold,
      onPress: () => {
        setActiveAdminSection('donations');
      },
    },
  ] as const;
  const adminRecentActivities = useMemo(() => {
    const adoptionActivities = store.adoptions.map((adoption) => {
      const pet = store.pets.find((item) => item.id === adoption.petId);
      return {
        id: `adoption-${adoption.id}`,
        title: `New adoption request for ${pet?.name ?? 'Unknown pet'}`,
        subtitle: `${adoption.fullName} • ${adoption.status}`,
        timeLabel: formatAdminDate(adoption.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        timestamp: getDateTimestamp(adoption.createdAt),
        icon: 'heart' as const,
        tint: '#ede9fe',
        accent: '#7c3aed',
        onPress: () => {
          setSelectedAdoptionId(adoption.id);
          setActiveAdminSection('adoptions');
        },
      };
    });

    const donationActivities = store.donations.map((donation) => ({
      id: `donation-${donation.id}`,
      title: `Donation from ${donation.anonymous ? 'Anonymous donor' : `${donation.name} ${donation.lastName}`.trim()}`,
      subtitle: `${formatAdminCurrency(donation.amount)} via ${paymentMethodVisuals[donation.paymentMethod].shortLabel}`,
      timeLabel: formatAdminDate(donation.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      timestamp: getDateTimestamp(donation.createdAt),
      icon: 'gift' as const,
      tint: '#dcfce7',
      accent: '#16a34a',
      onPress: () => {
        setSelectedDonationId(donation.id);
        setActiveAdminSection('donation-details');
      },
    }));

    const healthActivities = store.healthRecords.map((record) => {
      const pet = store.pets.find((item) => item.id === record.petId);
      return {
        id: `health-${record.id}`,
        title: `${pet?.name ?? 'Pet'} ${record.isCritical ? 'needs urgent care' : 'health update logged'}`,
        subtitle: record.diagnosis,
        timeLabel: formatAdminDate(record.reportedDate, { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: getDateTimestamp(record.reportedDate),
        icon: 'activity' as const,
        tint: '#dbeafe',
        accent: '#2563eb',
        onPress: () => {
          openAdminHealthRecord(record.petId);
          setHealthEditId(record.id);
          setHealthForm(makeHealthForm(record));
        },
      };
    });

    return [...adoptionActivities, ...donationActivities, ...healthActivities]
      .sort((left, right) => right.timestamp - left.timestamp)
      .slice(0, 5);
  }, [store.adoptions, store.donations, store.healthRecords, store.pets]);
  const adminSectionMeta: Record<AdminSection, { label: string; subtitle: string }> = {
    dashboard: { label: 'Operations Dashboard', subtitle: 'Shelter metrics, alerts, and actions at a glance.' },
    pets: { label: 'Pet Management', subtitle: 'Maintain pet records, status, and intake details.' },
    adoptions: { label: 'Adoption Review', subtitle: 'Inspect applications and move them through review.' },
    donations: { label: 'Donation Records', subtitle: 'Track giving activity and manage donation entries.' },
    'donation-details': { label: 'Donation Details', subtitle: 'Review one donation record in full detail.' },
    'health-record': { label: 'Health Record', subtitle: 'Review one pet health record and update care actions.' },
    health: { label: 'Health Modules', subtitle: 'Monitor treatment, vaccinations, and euthanasia logs.' },
  };
  const activeAdminMeta = adminSectionMeta[activeAdminSection];
  const openAdminHealthRecord = (petId: string) => {
    setSelectedHealthPetId(petId);
    setHealthEditId(null);
    setEuthanasiaEditId(null);
    setHealthForm(makeHealthForm(undefined, petId));
    setVaccineForm(makeVaccineForm(undefined, petId));
    setEuthanasiaForm(makeEuthanasiaForm(undefined, petId));
    setActiveAdminSection('health-record');
  };
  const openPetDetails = (petId: string, source: Exclude<PublicSection, 'pet-details'>) => {
    if (!clientAvailablePets.some((pet) => pet.id === petId)) return;

    setSelectedPetId(petId);
    setPetDetailsReturnSection(source);
    setActivePublicSection('pet-details');
  };
  const openPetApplication = (petId: string) => {
    if (!clientAvailablePets.some((pet) => pet.id === petId)) return;

    setSelectedPetId(petId);
    setPetApplicationError(null);
    setPetApplicationFieldErrors({});
    setActivePublicSection('pet-application');
  };
  const toggleFavoritePet = (petId: string) => {
    setFavoritePetIds((current) => (current.includes(petId) ? current.filter((id) => id !== petId) : [...current, petId]));
  };
  const clearPetApplicationFieldError = (field: PetApplicationFieldKey) => {
    setPetApplicationFieldErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  const syncPetApplicationDocuments = (uploads: UploadedDocument[]) => {
    setPetApplicationUploads(uploads);
    setPetApplicationError(null);
    clearPetApplicationFieldError('documents');
    setPetApplicationForm((current) => ({
      ...current,
      documents: uploads.map((upload) => upload.name).join(', '),
    }));
  };
  const pickSupportingDocuments = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
      type: '*/*',
    });

    if (result.canceled) return;

    const pickedUploads = result.assets.map((asset) => ({
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType,
      size: asset.size,
    }));
    const mergedUploads = [...petApplicationUploads];

    pickedUploads.forEach((upload) => {
      if (!mergedUploads.some((current) => current.uri === upload.uri || (current.name === upload.name && current.size === upload.size))) {
        mergedUploads.push(upload);
      }
    });

    syncPetApplicationDocuments(mergedUploads);
  };
  const removeSupportingDocument = (uri: string) => {
    syncPetApplicationDocuments(petApplicationUploads.filter((upload) => upload.uri !== uri));
  };
  const submitPetApplication = async () => {
    if (!selectedPet || isSubmittingPetApplication) return;

    const documents = petApplicationUploads.map((upload) => upload.name).filter(Boolean);
    const nextFieldErrors: Partial<Record<PetApplicationFieldKey, string>> = {};

    if (!petApplicationForm.fullName.trim()) nextFieldErrors.fullName = 'Full name is required.';
    if (!petApplicationForm.phone.trim()) nextFieldErrors.phone = 'Phone number is required.';
    if (!petApplicationForm.email.trim()) nextFieldErrors.email = 'Email address is required.';
    if (!petApplicationForm.address.trim()) nextFieldErrors.address = 'Address is required.';
    if (!petApplicationForm.household.trim()) nextFieldErrors.household = 'Household details are required.';
    if (!petApplicationForm.message.trim()) nextFieldErrors.message = `Explain why ${selectedPet.name} is a good fit for your home.`;
    if (documents.length === 0) nextFieldErrors.documents = 'Upload at least one supporting document.';

    if (Object.keys(nextFieldErrors).length > 0) {
      setPetApplicationFieldErrors(nextFieldErrors);
      setPetApplicationError('Please complete the highlighted required fields.');
      return;
    }

    setPetApplicationError(null);
    setPetApplicationFieldErrors({});
    setIsSubmittingPetApplication(true);

    const detailSegments = [
      petApplicationForm.address ? `Address: ${petApplicationForm.address}` : null,
      petApplicationForm.household ? `Household: ${petApplicationForm.household}` : null,
      petApplicationForm.message ? `Why this pet: ${petApplicationForm.message}` : null,
    ].filter(Boolean);

    try {
      await store.submitAdoption({
        petId: selectedPet.id,
        fullName: petApplicationForm.fullName.trim(),
        email: petApplicationForm.email.trim(),
        phone: petApplicationForm.phone.trim(),
        message: detailSegments.join('\n\n'),
        documents,
      });

      setPetApplicationForm((current) => ({
        ...current,
        household: '',
        message: '',
        documents: '',
      }));
      setPetApplicationUploads([]);
      store.dismissNotice();
      setIsPetApplicationSuccessModalVisible(true);
    } catch {
      setPetApplicationError('The application could not be submitted. Review the notice above and try again.');
    } finally {
      setIsSubmittingPetApplication(false);
    }
  };
  const submitClientDonation = async () => {
    if (isSubmittingDonation) return;

    setIsSubmittingDonation(true);

    try {
      await store.submitDonation({
        name: donationForm.name,
        lastName: donationForm.lastName,
        email: donationForm.email,
        state: donationForm.state,
        country: donationForm.country,
        zipCode: donationForm.zipCode,
        amount: donationAmountValue,
        anonymous: donationForm.anonymous,
        paymentMethod: donationForm.paymentMethod,
        paymentDetailSummary: `Method: ${donationPaymentDetails.label} | ${donationForm.detailA} | ${donationForm.detailB}`,
      });

      store.dismissNotice();
      setIsDonationSuccessModalVisible(true);
    } finally {
      setIsSubmittingDonation(false);
    }
  };
  const chooseDestination = (destination: RoleView) => {
    if (destination === 'developer') {
      setActiveRoleView('developer');
      setActiveDeveloperSection('users');
    } else if (destination === 'admin') {
      setActiveRoleView('admin');
      setActiveAdminSection('dashboard');
    } else {
      setActiveRoleView('public');
      setActivePublicSection('home');
    }

    setRedirectPrompt(null);
  };
  const appContextValue = {
    store,
    activeRoleView,
    setActiveRoleView,
    activePublicSection,
    setActivePublicSection,
    activeAdminSection,
    setActiveAdminSection,
    isAdminSidebarOpen,
    setIsAdminSidebarOpen,
    isAdminMoreMenuOpen,
    setIsAdminMoreMenuOpen,
    activeDeveloperSection,
    setActiveDeveloperSection,
    speciesFilter,
    setSpeciesFilter,
    adminPetSearchTerm,
    setAdminPetSearchTerm,
    adminPetStatusFilter,
    setAdminPetStatusFilter,
    authMode,
    setAuthMode,
    petDetailsReturnSection,
    setPetDetailsReturnSection,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    resetEmail,
    setResetEmail,
    favoritePetIds,
    setFavoritePetIds,
    selectedPetId,
    setSelectedPetId,
    petApplicationUploads,
    setPetApplicationUploads,
    petApplicationError,
    setPetApplicationError,
    petApplicationFieldErrors,
    setPetApplicationFieldErrors,
    isSubmittingPetApplication,
    setIsSubmittingPetApplication,
    isSubmittingDonation,
    setIsSubmittingDonation,
    petApplicationForm,
    setPetApplicationForm,
    selectedAdoptionId,
    setSelectedAdoptionId,
    adminAdoptionFilter,
    setAdminAdoptionFilter,
    selectedDonationId,
    setSelectedDonationId,
    adminDonationFilter,
    setAdminDonationFilter,
    adminDonationSearchTerm,
    setAdminDonationSearchTerm,
    adminHealthFilter,
    setAdminHealthFilter,
    adminHealthSearchTerm,
    setAdminHealthSearchTerm,
    selectedHealthPetId,
    setSelectedHealthPetId,
    selectedUserId,
    setSelectedUserId,
    activeDonationStep,
    setActiveDonationStep,
    donationForm,
    setDonationForm,
    isPaymentMethodMenuOpen,
    setIsPaymentMethodMenuOpen,
    notificationsEnabled,
    setNotificationsEnabled,
    faceIdEnabled,
    setFaceIdEnabled,
    showProfileEditor,
    setShowProfileEditor,
    showPasswordEditor,
    setShowPasswordEditor,
    profileForm,
    setProfileForm,
    passwordForm,
    setPasswordForm,
    petForm,
    setPetForm,
    petEditId,
    setPetEditId,
    healthForm,
    setHealthForm,
    healthEditId,
    setHealthEditId,
    vaccineForm,
    setVaccineForm,
    euthanasiaForm,
    setEuthanasiaForm,
    euthanasiaEditId,
    setEuthanasiaEditId,
    userRoleDraft,
    setUserRoleDraft,
    userStatusDraft,
    setUserStatusDraft,
    redirectPrompt,
    setRedirectPrompt,
    currentUser,
    currentUserId,
    currentUserRole,
    isAuthenticated,
    isCompactPhone,
    isShortScreen,
    isTablet,
    isDesktop,
    contentMaxWidth,
    authMaxWidth,
    horizontalPadding,
    recordWidthStyle,
    canSeeAdmin,
    canSeeDeveloper,
    defaultPetId,
    requiresRedirectChoice,
    showWorkspaceSwitcher,
    hasClientBottomNav,
    hasAdminBottomNav,
    useClientPetGrid,
    useCompactHomePreview,
    clientPetCardWidthStyle,
    adoptPetCardWidthStyle,
    homePetCardWidthStyle,
    clientSplitFieldStyle,
    clientFullFieldStyle,
    adminOverviewMetricWidthStyle,
    adminQuickActionWidthStyle,
    clientBottomNavDockPadding,
    adminBottomNavDockPadding,
    bottomContentPadding,
    filteredPets,
    adoptFilteredPets,
    adoptSpotlightPet,
    adminPetSearchQuery,
    adminPetStatusCounts,
    adminFilteredPets,
    adminAdoptionCounts,
    adminSortedAdoptions,
    adminFilteredAdoptions,
    adminDonationSearchQuery,
    adminDonationCounts,
    adminSortedDonations,
    adminFilteredDonations,
    adminHealthSearchQuery,
    adminVisibleVaccineSchedules,
    adminHealthQueue,
    adminHealthCounts,
    adminFilteredHealthQueue,
    selectedPet,
    selectedAdoption,
    selectedDonation,
    selectedManagedUser,
    selectedAdoptionPet,
    selectedAdoptionApplicant,
    selectedHealthItem,
    selectedHealthRecords,
    selectedHealthSchedules,
    selectedHealthLogs,
    selectedDonorHistory,
    selectedDonationDonorSince,
    selectedDonationTransactionId,
    selectedHealthLatestRecord,
    selectedHealthNextDueSchedule,
    selectedHealthTargetPetId,
    activeAdminTab,
    animateAdminSidebar,
    openAdminSidebar,
    closeAdminSidebar,
    closeAdminSidebarWithAction,
    toggleAdminMoreMenu,
    navigateAdminSection,
    openAdminVaccinationSchedule,
    openAdminEuthanasiaLogs,
    currentUserAdoptions,
    shelterContact,
    selectedPetVaccines,
    selectedPetHealthRecords,
    homePreviewPets,
    clientDisplayName,
    adminDisplayName,
    accountInitials,
    availablePetsCount,
    donationAmountValue,
    donationTotalValue,
    donationPaymentDetails,
    donationMethodOptions,
    activeDonationMethodVisual,
    pendingClientApplications,
    approvedClientApplications,
    unreadAdoptions,
    unreadDonations,
    pendingAdoptionRequests,
    criticalHealthAlerts,
    totalDonationsRaised,
    totalDonationDonors,
    adminNotificationCount,
    adminOverviewDateLabel,
    adminOverviewMetrics,
    adminAdoptionTabs,
    adminDonationTabs,
    adminDonationMetrics,
    adminHealthTabs,
    adminHealthMetrics,
    adminMenuMainItems,
    adminMoreMenuItems,
    adminQuickActions,
    adminRecentActivities,
    adminSectionMeta,
    activeAdminMeta,
    openAdminHealthRecord,
    openPetDetails,
    openPetApplication,
    toggleFavoritePet,
    clearPetApplicationFieldError,
    syncPetApplicationDocuments,
    pickSupportingDocuments,
    removeSupportingDocument,
    submitPetApplication,
    submitClientDonation,
    chooseDestination,
    adminSidebarTranslateX,
    adminSidebarOpacity,
    viewportWidth,
    viewportHeight,
  };

  const loginCard = (
    <View style={[styles.loginShell, { maxWidth: authMaxWidth }]}>
      <View style={styles.loginBackdrop}>
        <View style={styles.loginAccentPrimary} />
        <View style={styles.loginAccentSecondary} />
      </View>
      <View style={[styles.loginLayout, isTablet && styles.loginLayoutWide]}>
        <View style={[styles.loginCard, isTablet && styles.loginCardWide]}>
          <Text style={styles.loginEyebrow}>Animal Shelter</Text>
          <Text style={styles.loginTitle}>
            {authMode === 'login' ? 'Welcome back' : authMode === 'register' ? 'Create account' : 'Reset password'}
          </Text>
          <Text style={styles.loginSubtitle}>
            {authMode === 'login'
              ? 'Sign in to manage rescue operations, adoptions, donations, and care workflows.'
              : authMode === 'register'
                ? 'Create your account to access the shelter portal.'
                : 'Enter your email and we will send a password reset link.'}
          </Text>

          {authMode === 'login' ? (
            <View style={styles.demoAccountRow}>
              {demoAccounts.map((account) => (
                <Pressable key={account.label} style={pressableFeedback(styles.demoAccountChip)} onPress={() => setLoginForm({ email: account.email, password: account.password })}>
                  <Text style={styles.demoAccountChipText}>{account.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {authMode === 'register' ? <Text style={styles.helper}>Use a unique email and a password with at least 8 characters.</Text> : null}

          <View style={styles.authModeRow}>
            <AuthLink label="Sign In" active={authMode === 'login'} onPress={() => setAuthMode('login')} />
            <AuthLink label="Register" active={authMode === 'register'} onPress={() => setAuthMode('register')} />
            <AuthLink label="Forgot Password" active={authMode === 'forgot-password'} onPress={() => setAuthMode('forgot-password')} />
          </View>

          {authMode === 'login' ? (
            <>
              <View style={styles.loginFieldGroup}>
                <Field label="Email" value={loginForm.email} onChangeText={(value) => setLoginForm((current) => ({ ...current, email: value }))} />
                <Field label="Password" value={loginForm.password} secureTextEntry onChangeText={(value) => setLoginForm((current) => ({ ...current, password: value }))} />
              </View>

              <PrimaryButton label="Sign In" onPress={() => store.login(loginForm)} />
            </>
          ) : null}

          {authMode === 'register' ? (
            <>
              <View style={styles.loginFieldGroup}>
                <Field label="Full Name" value={registerForm.name} onChangeText={(value) => setRegisterForm((current) => ({ ...current, name: value }))} />
                <Field label="Email" value={registerForm.email} onChangeText={(value) => setRegisterForm((current) => ({ ...current, email: value }))} />
                <Field label="Password" value={registerForm.password} secureTextEntry onChangeText={(value) => setRegisterForm((current) => ({ ...current, password: value }))} />
              </View>

              <PrimaryButton label="Create Account" onPress={() => store.register(registerForm)} />
            </>
          ) : null}

          {authMode === 'forgot-password' ? (
            <>
              <View style={styles.loginFieldGroup}>
                <Field label="Email" value={resetEmail} onChangeText={setResetEmail} />
              </View>

              <SecondaryButton label="Send Reset Link" onPress={() => store.requestPasswordReset(resetEmail)} />
            </>
          ) : null}
        </View>
      </View>
    </View>
  );

  const sessionCard = currentUser ? (
    <Card title={`Signed in as ${currentUser.name}`} subtitle="Session">
      <View style={styles.sessionSummary}>
        <View style={styles.sessionChip}>
          <Text style={styles.sessionChipLabel}>Role</Text>
          <Text style={styles.sessionChipValue}>{currentUser.role}</Text>
        </View>
        <View style={styles.sessionChip}>
          <Text style={styles.sessionChipLabel}>Status</Text>
          <Text style={styles.sessionChipValue}>{currentUser.status}</Text>
        </View>
      </View>
      <Text style={styles.helper}>{currentUser.email}</Text>
      <Text style={styles.helper}>
        {currentUser.role === 'developer'
          ? 'Developer tools are unlocked. Use the Developer workspace to manage users.'
          : currentUser.role === 'admin'
            ? 'Admin tools are unlocked. Use the Admin workspace to manage shelter operations.'
            : 'Your account area is available in the Public workspace.'}
      </Text>
      <SecondaryButton label="Logout" onPress={store.logout} />
    </Card>
  ) : null;
  const redirectChooserCard = redirectPrompt ? (
    <Card
      title="Choose Where To Go"
      subtitle={redirectPrompt.role === 'developer' ? 'Developer Redirect' : 'Admin Redirect'}>
      <Text style={styles.helper}>{currentUser?.name}</Text>
      <Text style={styles.helper}>
        {redirectPrompt.role === 'developer'
          ? 'This account can open the client, admin, or developer workspace. Choose the destination for this session.'
          : 'This account can open the client or admin workspace. Choose the destination for this session.'}
      </Text>
      <View style={styles.redirectOptionList}>
        <Pressable style={pressableFeedback(styles.redirectOption)} onPress={() => chooseDestination('public')}>
          <Text style={styles.redirectOptionTitle}>Client Page</Text>
          <Text style={styles.redirectOptionText}>Open the client-facing workspace and land on the home section.</Text>
        </Pressable>
        <Pressable style={pressableFeedback(styles.redirectOption)} onPress={() => chooseDestination('admin')}>
          <Text style={styles.redirectOptionTitle}>Admin Page</Text>
          <Text style={styles.redirectOptionText}>Open the shelter operations workspace for pets, adoptions, donations, and health.</Text>
        </Pressable>
        {redirectPrompt.role === 'developer' ? (
          <Pressable style={pressableFeedback(styles.redirectOption)} onPress={() => chooseDestination('developer')}>
            <Text style={styles.redirectOptionTitle}>Developer Page</Text>
            <Text style={styles.redirectOptionText}>Open the developer workspace for user-role and account management.</Text>
          </Pressable>
        ) : null}
      </View>
      <SecondaryButton label="Logout" onPress={store.logout} />
    </Card>
  ) : null;
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={[styles.content, styles.authContent, { paddingHorizontal: horizontalPadding }]}
            keyboardShouldPersistTaps="handled">
            <View style={[styles.authStack, { maxWidth: authMaxWidth }]}>
              {store.notice ? (
                <Pressable style={pressableFeedback(styles.authNotice)} onPress={store.dismissNotice}>
                  <Feather name="bell" size={16} color={palette.clayDeep} />
                  <Text style={styles.noticeText}>{store.notice}</Text>
                </Pressable>
              ) : null}
              {loginCard}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (requiresRedirectChoice) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={[styles.content, styles.authContent, { paddingHorizontal: horizontalPadding }]}
            keyboardShouldPersistTaps="handled">
            <View style={[styles.authStack, { maxWidth: 620 }]}>
              {store.notice ? (
                <Pressable style={pressableFeedback(styles.authNotice)} onPress={store.dismissNotice}>
                  <Feather name="bell" size={16} color={palette.clayDeep} />
                  <Text style={styles.noticeText}>{store.notice}</Text>
                </Pressable>
              ) : null}
              {redirectChooserCard}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <ShelterAppProvider value={appContextValue}>
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding, paddingBottom: bottomContentPadding }]}
          scrollIndicatorInsets={{ bottom: bottomContentPadding }}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.appShell, { maxWidth: contentMaxWidth }]}>
            {activeRoleView !== 'public' && activeRoleView !== 'admin' ? (
              <View style={styles.hero}>
                <Text style={styles.heroKicker}>Animal Shelter Mobile</Text>
                <Text style={styles.heroTitle}>Premium rescue operations in one mobile workspace.</Text>
                <Text style={styles.heroText}>This app mirrors the Laravel project modules: authentication, pets, adoptions, donations, health monitoring, vaccination, euthanasia, admin metrics, and developer user controls.</Text>
                <View style={styles.roleRow}>
                  <RolePill label="Client" active={false} onPress={() => setActiveRoleView('public')} />
                  <RolePill label="Admin" active={false} onPress={() => canSeeAdmin && setActiveRoleView('admin')} disabled={!canSeeAdmin} />
                  <RolePill label="Developer" active onPress={() => canSeeDeveloper && setActiveRoleView('developer')} disabled={!canSeeDeveloper} />
                </View>
              </View>
            ) : null}

        {visibleStoreNotice ? (
          <Animated.View style={{
            opacity: noticeOpacity,
            transform: [{
              translateY: noticeOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-8, 0],
              }),
            }],
          }}>
            <Pressable style={pressableFeedback(styles.notice)} onPress={store.dismissNotice}>
              <Feather name="bell" size={16} color={palette.clayDeep} />
              <Text style={styles.noticeText}>{visibleStoreNotice}</Text>
            </Pressable>
          </Animated.View>
        ) : null}

        {activeRoleView !== 'public' && activeRoleView !== 'admin' ? sessionCard : null}

        {activeRoleView === 'public' ? <ClientWorkspace /> : null}

        {activeRoleView === 'admin' && canSeeAdmin ? <AdminWorkspace /> : null}

        {activeRoleView === 'developer' && canSeeDeveloper ? <DeveloperWorkspace /> : null}
          </View>
        </ScrollView>
        {isPetApplicationSuccessModalVisible ? (
          <View style={styles.petApplicationSuccessOverlay}>
            <View style={styles.petApplicationSuccessModal}>
              <View style={styles.petApplicationSuccessIcon}>
                <Feather name="check" size={28} color="#ffffff" />
              </View>
              <Text style={styles.petApplicationSuccessTitle}>Application submitted</Text>
              <Text style={styles.petApplicationSuccessText}>Your adoption application was sent successfully. The shelter team will review it and update your account history.</Text>
              <Pressable style={pressableFeedback(styles.petApplicationSuccessButton)} onPress={() => setIsPetApplicationSuccessModalVisible(false)}>
                <Text style={styles.petApplicationSuccessButtonText}>Done</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        {isDonationSuccessModalVisible ? (
          <View style={styles.petApplicationSuccessOverlay}>
            <View style={styles.petApplicationSuccessModal}>
              <View style={styles.petApplicationSuccessIcon}>
                <Feather name="gift" size={28} color="#ffffff" />
              </View>
              <Text style={styles.petApplicationSuccessTitle}>Donation submitted</Text>
              <Text style={styles.petApplicationSuccessText}>Your donation was recorded successfully. Thank you for supporting the shelter rescue fund.</Text>
              <Pressable style={pressableFeedback(styles.petApplicationSuccessButton)} onPress={() => setIsDonationSuccessModalVisible(false)}>
                <Text style={styles.petApplicationSuccessButtonText}>Done</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        {activeRoleView === 'admin' && canSeeAdmin && isAdminSidebarOpen ? (
          <View style={styles.adminSidebarOverlay} pointerEvents="box-none">
            <Pressable style={styles.adminSidebarBackdrop} onPress={() => closeAdminSidebar()} />
            <Animated.View style={[styles.adminSidebarSheet, { opacity: adminSidebarOpacity, transform: [{ translateX: adminSidebarTranslateX }] }]}>
              <View style={styles.adminSidebarPage}>
                <View style={styles.adminSidebarIntro}>
                  <View style={styles.adminSidebarIntroCopy}>
                    <Text style={styles.adminSidebarTitle}>Admin Panel</Text>
                    <Text style={styles.adminSidebarText}>Shelter care and rescue operations</Text>
                  </View>
                  <View style={styles.adminSidebarIntroActions}>
                    <View style={styles.adminSidebarBadge}>
                      <Text style={styles.adminSidebarBadgeText}>{accountInitials}</Text>
                    </View>
                    <Pressable style={pressableFeedback(styles.adminSidebarCloseButton)} onPress={() => closeAdminSidebar()}>
                      <Feather name="x" size={16} color={palette.ink} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.adminSidebarGroup}>
                  <Text style={styles.adminSidebarGroupLabel}>Navigation</Text>
                  <View style={styles.adminSidebarList}>
                    {adminMenuMainItems.map((item) => {
                      const isActive = item.key === 'dashboard'
                        ? activeAdminSection === 'dashboard'
                        : item.key === 'pets'
                          ? activeAdminSection === 'pets'
                          : item.key === 'adoptions'
                            ? activeAdminSection === 'adoptions'
                            : item.key === 'donations'
                              ? activeAdminSection === 'donations' || activeAdminSection === 'donation-details'
                              : activeAdminSection === 'health' || activeAdminSection === 'health-record';

                      return (
                        <AdminSidebarNavItem
                          key={item.key}
                          label={item.label}
                          description={item.description}
                          icon={item.icon}
                          tint={item.tint}
                          accent={item.accent}
                          active={isActive}
                          onPress={() => closeAdminSidebarWithAction(item.onPress)}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        ) : null}
        {activeRoleView === 'admin' && canSeeAdmin && isAdminMoreMenuOpen ? (
          <View style={styles.adminMoreMenuOverlay} pointerEvents="box-none">
            <Pressable style={styles.adminMoreMenuBackdrop} onPress={() => setIsAdminMoreMenuOpen(false)} />
            <View style={[styles.adminMoreMenuCard, { bottom: adminBottomNavDockPadding + (isTablet ? 96 : 94), width: Math.min(isTablet ? 420 : viewportWidth - horizontalPadding * 2, 420) }]}>
              <View style={styles.adminMoreMenuHandle} />
              <View style={styles.adminMoreMenuList}>
                {adminMoreMenuItems.map((item) => (
                  <AdminMoreMenuItem
                    key={item.key}
                    label={item.label}
                    description={item.description}
                    icon={item.icon}
                    tint={item.tint}
                    accent={item.accent}
                    onPress={item.onPress}
                  />
                ))}
              </View>
            </View>
          </View>
        ) : null}
        {hasClientBottomNav ? (
          <View style={[styles.clientBottomNavWrap, { paddingHorizontal: horizontalPadding, paddingBottom: clientBottomNavDockPadding }]}>
            <View style={[styles.clientBottomNav, { maxWidth: isTablet ? 640 : 520 }]}>
              <ClientTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Home" icon="home" active={activePublicSection === 'home'} onPress={() => setActivePublicSection('home')} />
              <ClientTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Adopt" icon="heart" active={activePublicSection === 'pets' || activePublicSection === 'pet-details' || activePublicSection === 'pet-application'} onPress={() => setActivePublicSection('pets')} />
              <ClientTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Donate" icon="gift" active={activePublicSection === 'donations'} onPress={() => setActivePublicSection('donations')} />
              <ClientTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Account" icon="user" active={activePublicSection === 'account'} onPress={() => setActivePublicSection('account')} />
            </View>
          </View>
        ) : null}
        {hasAdminBottomNav ? (
          <View style={[styles.adminBottomNavWrap, { paddingHorizontal: horizontalPadding, paddingBottom: adminBottomNavDockPadding }]}>
            <View style={[styles.adminBottomNav, { maxWidth: isTablet ? 720 : 560 }]}>
              <AdminBottomTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Dashboard" icon="home" active={activeAdminTab === 'dashboard'} onPress={() => navigateAdminSection('dashboard')} />
              <AdminBottomTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Pets" icon="grid" active={activeAdminTab === 'pets'} onPress={() => navigateAdminSection('pets')} />
              <AdminBottomTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Adoptions" icon="heart" active={activeAdminTab === 'adoptions'} onPress={() => navigateAdminSection('adoptions')} />
              <AdminBottomTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="Donations" icon="gift" active={activeAdminTab === 'donations'} onPress={() => navigateAdminSection('donations')} />
              <AdminBottomTab compact={useCompactBottomNav} roomy={useRoomyBottomNav} label="More" icon="more-horizontal" active={activeAdminTab === 'more' || isAdminMoreMenuOpen} onPress={toggleAdminMoreMenu} />
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ShelterAppProvider>
  );
}
