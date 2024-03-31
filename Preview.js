import { View, ScrollView, Text, StyleSheet } from 'react-native';
import React from "react";

export default function Preview({ navigation, route }) {
  console.log(typeof route.params.code)
  const code = route.params.code
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.code}>{code}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  code: {
    fontSize: 20,
    color: '#333',
  },
  scrollView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});