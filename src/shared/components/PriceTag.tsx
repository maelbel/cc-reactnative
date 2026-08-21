import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TrainingPrice } from '../../domain/models/Training';

interface Props {
  price: TrainingPrice;
}

const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

/** Renders the most relevant price for a training, or a fallback when none is set. */
export function PriceTag({ price }: Props) {
  const amount = price.standard ?? price.custom ?? price.remote;
  return <Text style={styles.text}>{amount != null ? formatter.format(amount) : 'Prix sur demande'}</Text>;
}

const styles = StyleSheet.create({
  text: { fontWeight: '600', color: '#1d4ed8' },
});
