import type { ComponentType } from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';

import { IconeAccueil, IconeConseils, IconeResultats, IconeSession } from '@/components/icones';
import { couleurs, polices } from '@/styles/theme';

function libelle(texte: string) {
  return function Libelle({ focused }: { focused: boolean }) {
    return (
      <Text
        style={{
          fontFamily: focused ? polices.semiBold : polices.medium,
          fontSize: 11,
          color: focused ? couleurs.vert : couleurs.ongletInactif,
          marginTop: 4,
        }}
      >
        {texte}
      </Text>
    );
  };
}

function icone(Icone: ComponentType<{ couleur: string }>) {
  return function IconeOnglet({ focused }: { focused: boolean }) {
    return <Icone couleur={focused ? couleurs.vert : couleurs.ongletInactif} />;
  };
}

export default function OngletsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: couleurs.fond },
        tabBarStyle: {
          backgroundColor: couleurs.carte,
          borderTopColor: couleurs.bordure,
          borderTopWidth: 1,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarLabel: libelle('Accueil'), tabBarIcon: icone(IconeAccueil) }}
      />
      <Tabs.Screen
        name="sessions"
        options={{ tabBarLabel: libelle('Sessions'), tabBarIcon: icone(IconeSession) }}
      />
      <Tabs.Screen
        name="resultats"
        options={{ tabBarLabel: libelle('Résultats'), tabBarIcon: icone(IconeResultats) }}
      />
      <Tabs.Screen
        name="conseils"
        options={{ tabBarLabel: libelle('Conseils'), tabBarIcon: icone(IconeConseils) }}
      />
    </Tabs>
  );
}
