import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type HomeOverviewCardProps = {
  label: string;
  value: string;
  color: string;
  subtitle?: string;
  footer?: string;
  footerPosition?: 'left' | 'right';
};

export default function HomeOverviewCard({
  label,
  value,
  color,
  subtitle,
  footer,
  footerPosition = 'left',
}: HomeOverviewCardProps) {
  const shouldShowBottomFooter = footer && footerPosition === 'left';
  const shouldShowRightFooter = footer && footerPosition === 'right';

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={styles.label}>{label}</Text>

          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.right}>
          <Text style={styles.value}>{value}</Text>

          {shouldShowRightFooter ? (
            <Text style={styles.rightFooter}>{footer}</Text>
          ) : null}
        </View>
      </View>

      {shouldShowBottomFooter ? (
        <Text style={styles.footer}>{footer}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#142449',
    borderRadius: 19,
    borderLeftWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 76,
    justifyContent: 'center',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flex: 1,
    marginRight: 12,
  },

  right: {
    alignItems: 'flex-end',
  },

  label: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },

  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'right',
  },

  rightFooter: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
    textAlign: 'right',
  },

  footer: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '700',
  },
});