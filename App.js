import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- VOIDY SINGLE FILE APP FOR SNACK ---
export default function App() {
  const [screen, setScreen] = useState('loading'); // loading, onboarding, home
  const [profile, setProfile] = useState(null);

  // Onboarding state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setTimeout(async () => {
      const saved = await AsyncStorage.getItem('voidy_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
        setScreen('home');
      } else {
        setScreen('onboarding');
      }
    }, 3000);
  }, []);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access needed');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !bio.trim()) {
      Alert.alert('Required', 'Name and Bio required');
      return;
    }
    const data = {
      name: name.trim(),
      bio: bio.trim(),
      age: age || '',
      country: country.trim(),
      avatar:
        avatar || 'https://via.placeholder.com/150/08060F/FFD700?text=VOID',
      currentStreak: 5,
      longestStreak: 5,
      points: 150,
    };
    await AsyncStorage.setItem('voidy_profile', JSON.stringify(data));
    setProfile(data);
    setScreen('home');
  };

  if (screen === 'loading') {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingLogo}>Ø</Text>
        <Text style={styles.loadingText}>VOIDY</Text>
      </View>
    );
  }

  if (screen === 'home') {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.homeTitle}>We</Text>
        <Text style={styles.homeSub}>
          {profile?.name} • Record: {profile?.longestStreak} days
        </Text>
        <Text style={styles.homeSub}>BIO: {profile?.bio}</Text>
        <Text style={styles.homePts}>100 PTS</Text>
        {profile?.avatar && (
          <Image
            source={{ uri: profile.avatar }}
            style={{ width: 80, height: 80, borderRadius: 40, marginTop: 20 }}
          />
        )}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            await AsyncStorage.clear();
            setScreen('onboarding');
          }}>
          <Text style={styles.saveButtonText}>LOGOUT / RESET</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CLAIM YOUR VOID PROFILE</Text>
      <Text style={styles.subtitle}>Set your streak identity to begin</Text>
      <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrapper}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarIconText}>Ø</Text>
            <Text style={styles.avatarPickLabel}>Pick Avatar</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>NAME * (REQUIRED)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Aurelius"
          placeholderTextColor="#9A9A9A"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>BIO * (REQUIRED)</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="e.g. Forging unstoppable discipline."
          placeholderTextColor="#9A9A9A"
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>AGE (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 25"
          placeholderTextColor="#9A9A9A"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>COUNTRY (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Canada"
          placeholderTextColor="#9A9A9A"
          value={country}
          onChangeText={setCountry}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>SAVE & START VOID STREAK</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#08060F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: { fontSize: 80, color: '#FFD700', fontWeight: '900' },
  loadingText: {
    color: '#FFD700',
    letterSpacing: 8,
    marginTop: 10,
    fontWeight: '800',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#08060F',
    padding: 24,
    paddingTop: 60,
  },
  homeTitle: { fontSize: 32, color: '#FFF', fontWeight: '800' },
  homeSub: { color: '#9A9A9A', marginTop: 8 },
  homePts: { color: '#FFD700', fontSize: 20, fontWeight: '800', marginTop: 20 },
  container: { backgroundColor: '#08060F', padding: 24, paddingTop: 56 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  avatarWrapper: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#FFD700',
    overflow: 'hidden',
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: { alignItems: 'center' },
  avatarIconText: { fontSize: 32, color: '#FFD700', fontWeight: '900' },
  avatarPickLabel: {
    fontSize: 11,
    color: '#FFC300',
    fontWeight: '600',
    marginTop: 2,
  },
  fieldContainer: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 11,
    color: '#9A9A9A',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  bioInput: { height: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#08060F',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
});
