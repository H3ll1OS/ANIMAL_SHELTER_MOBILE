import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminDashboardPage() {
  const {
    activeAdminSection,
    setActiveAdminSection,
    adminOverviewMetricWidthStyle,
    adminQuickActionWidthStyle,
    adminDisplayName,
    adminOverviewDateLabel,
    adminOverviewMetrics,
    adminQuickActions,
    adminRecentActivities,
  } = useShelterAppContext();

  return (
    <>
            {activeAdminSection === 'dashboard' ? (
              <>
                <View style={styles.adminDashboardIntro}>
                  <Text style={styles.adminDashboardTitle}>Dashboard</Text>
                  <Text style={styles.adminDashboardSubtitle}>Welcome back, {adminDisplayName}.</Text>
                </View>

                <View style={styles.adminOverviewCard}>
                  <View style={styles.adminOverviewHeader}>
                    <View>
                      <Text style={styles.adminOverviewEyebrow}>Today Overview</Text>
                      <Text style={styles.adminOverviewDate}>{adminOverviewDateLabel}</Text>
                    </View>
                    <View style={styles.adminOverviewCalendar}>
                      <Feather name="calendar" size={16} color="#ffffff" />
                    </View>
                  </View>
                  <View style={styles.adminOverviewGrid}>
                    {adminOverviewMetrics.map((item) => (
                      <View key={item.label} style={[styles.adminOverviewMetricCard, adminOverviewMetricWidthStyle]}>
                        <View style={[styles.adminOverviewMetricIcon, { backgroundColor: item.tint }]}>
                          <Feather name={item.icon} size={16} color={item.accent} />
                        </View>
                        <Text style={styles.adminOverviewMetricValue}>{item.value}</Text>
                        <Text style={styles.adminOverviewMetricLabel}>{item.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.adminDashboardSection}>
                  <Text style={styles.adminDashboardSectionTitle}>Quick Actions</Text>
                  <View style={styles.adminQuickActionGrid}>
                    {adminQuickActions.map((action) => (
                      <Pressable key={action.label} style={[styles.adminQuickActionCard, adminQuickActionWidthStyle]} onPress={action.onPress}>
                        <View style={[styles.adminQuickActionIcon, { backgroundColor: action.tint }]}>
                          <Feather name={action.icon} size={18} color={action.accent} />
                        </View>
                        <Text style={styles.adminQuickActionLabel}>{action.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.adminDashboardSection}>
                  <View style={styles.adminRecentHeader}>
                    <Text style={styles.adminDashboardSectionTitle}>Recent Activities</Text>
                    <Pressable onPress={() => setActiveAdminSection('adoptions')}>
                      <Text style={styles.adminRecentLink}>View all</Text>
                    </Pressable>
                  </View>
                  <View style={styles.adminRecentList}>
                    {adminRecentActivities.map((activity, index) => (
                      <Pressable key={activity.id} style={[styles.adminRecentItem, index === adminRecentActivities.length - 1 && styles.adminRecentItemLast]} onPress={activity.onPress}>
                        <View style={[styles.adminRecentIconWrap, { backgroundColor: activity.tint }]}>
                          <Feather name={activity.icon} size={17} color={activity.accent} />
                        </View>
                        <View style={styles.adminRecentCopy}>
                          <Text style={styles.adminRecentTitle}>{activity.title}</Text>
                          <Text style={styles.adminRecentMeta}>{activity.subtitle}</Text>
                          <Text style={styles.adminRecentTime}>{activity.timeLabel}</Text>
                        </View>
                        <Feather name="chevron-right" size={16} color="#cbd5e1" />
                      </Pressable>
                    ))}
                    {adminRecentActivities.length === 0 ? (
                      <View style={styles.adminRecentEmptyState}>
                        <Text style={styles.adminRecentEmptyTitle}>No activity yet</Text>
                        <Text style={styles.adminRecentEmptyText}>New requests, donations, and health updates will appear here.</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </>
            ) : null}
    </>
  );
}

export default function AdminDashboardRoute() {
  return <ShelterMobileApp initialRoleView="admin" initialAdminSection="dashboard" />;
}
