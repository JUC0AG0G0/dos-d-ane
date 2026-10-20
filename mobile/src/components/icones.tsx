import Svg, { Path } from 'react-native-svg';

/**
 * Icônes de la maquette Figma, tracés copiés tels quels. Seule la couleur du
 * trait est paramétrable (onglet actif ou inactif, par exemple).
 */
type Props = { couleur: string; taille?: number };

const trait = {
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function IconeAccueil({ couleur, taille = 24 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11L12 3L21 11V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H15V15H9V21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V11Z"
        stroke={couleur}
        {...trait}
      />
    </Svg>
  );
}

export function IconeSession({ couleur, taille = 24 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H7M17 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M21 17V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H17M7 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17"
        stroke={couleur}
        {...trait}
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={couleur}
        {...trait}
      />
    </Svg>
  );
}

export function IconeResultats({ couleur, taille = 24 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3V21H21" stroke={couleur} {...trait} />
      <Path d="M7 15L11 10L14 13L19 6" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeConseils({ couleur, taille = 24 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20V3H6.5C5.83696 3 5.20107 3.26339 4.73223 3.73223C4.26339 4.20107 4 4.83696 4 5.5V19.5Z"
        stroke={couleur}
        {...trait}
      />
      <Path
        d="M20 17V21H6.5C5.83696 21 5.20107 20.7366 4.73223 20.2678C4.26339 19.7989 4 19.163 4 18.5"
        stroke={couleur}
        {...trait}
      />
    </Svg>
  );
}

export function IconeScan({ couleur, taille = 20 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 20 20" fill="none">
      <Path
        d="M2.5 5.83333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H5.83333M14.1667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V5.83333M17.5 14.1667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H14.1667M5.83333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V14.1667"
        stroke={couleur}
        {...trait}
      />
      <Path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke={couleur}
        {...trait}
      />
    </Svg>
  );
}

export function IconeFeuille({ couleur, taille = 22 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 22 22" fill="none">
      <Path
        d="M10.0833 18.3333C8.38153 18.3333 6.74942 17.6573 5.54606 16.4539C4.34271 15.2506 3.66667 13.6185 3.66667 11.9167C3.66667 6.41667 9.16667 3.66667 18.3333 3.66667C18.3333 12.8333 15.5833 18.3333 10.0833 18.3333Z"
        stroke={couleur}
        {...trait}
      />
      <Path d="M3.66667 19.25C6.41667 13.75 9.16667 11 13.75 9.16667" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeInfo({ couleur, taille = 18 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 18 18" fill="none">
      <Path
        d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z"
        stroke={couleur}
        {...trait}
      />
      <Path d="M9 8.25V12M9 6H9.0075" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeFermer({ couleur, taille = 20 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 20 20" fill="none">
      <Path d="M15 5L5 15M5 5L15 15" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeInfoRond({ couleur, taille = 20 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        stroke={couleur}
        {...trait}
      />
      <Path d="M10 9.16667V13.3333M10 6.66667H10.0083" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeAlerte({ couleur, taille = 20 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 20 20" fill="none">
      <Path
        d="M8.58333 3.25L1.5 15C1.3548 15.2514 1.27779 15.5364 1.2766 15.8267C1.27541 16.117 1.35008 16.4026 1.49322 16.6552C1.63635 16.9078 1.84299 17.1186 2.09266 17.2668C2.34233 17.415 2.62638 17.4954 2.91667 17.5H17.0833C17.3736 17.4954 17.6577 17.415 17.9073 17.2668C18.157 17.1186 18.3636 16.9078 18.5068 16.6552C18.6499 16.4026 18.7246 16.117 18.7234 15.8267C18.7222 15.5364 18.6452 15.2514 18.5 15L11.4167 3.25C11.2672 3.00882 11.0586 2.80979 10.8107 2.67177C10.5628 2.53375 10.2837 2.4613 10 2.4613C9.71625 2.4613 9.43721 2.53375 9.18929 2.67177C8.94138 2.80979 8.73281 3.00882 8.58333 3.25Z"
        stroke={couleur}
        {...trait}
      />
      <Path d="M10 7.5V10.8333M10 14.1667H10.0083" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconePersonne({ couleur, taille = 26 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 26 26" fill="none">
      <Path
        d="M13 13C15.3932 13 17.3333 11.0599 17.3333 8.66667C17.3333 6.27343 15.3932 4.33333 13 4.33333C10.6068 4.33333 8.66667 6.27343 8.66667 8.66667C8.66667 11.0599 10.6068 13 13 13Z"
        stroke={couleur}
        {...trait}
      />
      <Path
        d="M4.33333 22.75C4.33333 18.4167 8.66667 16.25 13 16.25C17.3333 16.25 21.6667 18.4167 21.6667 22.75"
        stroke={couleur}
        {...trait}
      />
    </Svg>
  );
}

export function IconeActivite({ couleur, taille = 26 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 26 26" fill="none">
      <Path
        d="M3.25 13H7.58333L10.8333 4.33333L15.1667 21.6667L18.4167 13H22.75"
        stroke={couleur}
        {...trait}
      />
    </Svg>
  );
}

export function IconeHorloge({ couleur, taille = 26 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 26 26" fill="none">
      <Path
        d="M13 22.75C18.3848 22.75 22.75 18.3848 22.75 13C22.75 7.61522 18.3848 3.25 13 3.25C7.61522 3.25 3.25 7.61522 3.25 13C3.25 18.3848 7.61522 22.75 13 22.75Z"
        stroke={couleur}
        {...trait}
      />
      <Path d="M13 7.58333V13L16.25 15.1667" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeChevron({ couleur, taille = 20 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 20 20" fill="none">
      <Path d="M7.5 15L12.5 10L7.5 5" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeFlecheGauche({ couleur, taille = 18 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 18 18" fill="none">
      <Path d="M11.25 13.5L6.75 9L11.25 4.5" stroke={couleur} {...trait} />
    </Svg>
  );
}

export function IconeFlecheDroite({ couleur, taille = 18 }: Props) {
  return (
    <Svg width={taille} height={taille} viewBox="0 0 18 18" fill="none">
      <Path d="M6.75 13.5L11.25 9L6.75 4.5" stroke={couleur} {...trait} />
    </Svg>
  );
}
