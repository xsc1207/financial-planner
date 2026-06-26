import { Text } from 'expo-router/build/react-navigation';
import { StyleSheet, View } from 'react-native';

export default function HighlightCard() {
  return (
    <View style={styles.balanceCard}>
  <View>
    <Text style={styles.balanceLabel}>Available Balance</Text>
    <Text style={styles.balanceSubtitle}>
      After planned expenses
    </Text>
  </View>

  <Text style={styles.balanceAmount}>£850</Text>
</View>
  );
}

export const colors = {
    background: '#151529',
    surface: '#172344',
    primary: '#38BDF8',
    text: '#FFFFFF',
    textSecondary: '#A5A5B8',
  };

  const styles = StyleSheet.create({
    balanceCard: {
        backgroundColor: '#172344',
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 18,
        marginTop: 24,
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      
      balanceLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
      },
      
      balanceSubtitle: {
        color: '#A5A5B8',
        fontSize: 13,
      },
      
      balanceAmount: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '700',
      },
  });