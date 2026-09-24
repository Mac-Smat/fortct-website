import procureLogo from '../../assets/Client Logos/client-logo-procure.svg'
import clerkLogo from '../../assets/Client Logos/client-logo-clerk.svg'
import blenderLogo from '../../assets/Client Logos/client-logo-blender.svg'
import figmaLogo from '../../assets/Client Logos/client-logo-figma.svg'
import mochaLogo from '../../assets/Client Logos/client-logo-mocha.svg'
import layersLogo from '../../assets/Client Logos/client-logo-layers.svg'
import googleCloudLogo from '../../assets/Client Logos/client-logo-google-cloud.svg'
import framerLogo from '../../assets/Client Logos/client-logo-framer.svg'

// Logos shown in the landing-page marquee. Swap the files in
// `assets/Client Logos/` and update the entries below to use real client logos.
export const CLIENT_LOGOS = [
  {
    src: procureLogo,
    alt: 'Procure',
    gradient: { from: '#668CFF', via: '#0049FF', to: '#003199' },
  },
  {
    src: clerkLogo,
    alt: 'Clerk',
    gradient: { from: '#FFE766', via: '#FFCE00', to: '#B38F00' },
  },
  {
    src: blenderLogo,
    alt: 'Blender',
    gradient: { from: '#6690F0', via: '#255BE3', to: '#193B99' },
  },
  {
    src: figmaLogo,
    alt: 'Figma',
    gradient: { from: '#C4C2FF', via: '#9896FF', to: '#5B4DCC' },
  },
  {
    src: mochaLogo,
    alt: 'Mocha',
    gradient: { from: '#FF66A1', via: '#FF007A', to: '#B3005A' },
  },
  {
    src: layersLogo,
    alt: 'Layers',
    gradient: { from: '#D9FF5A', via: '#AFFF01', to: '#7A9900' },
  },
  {
    src: googleCloudLogo,
    alt: 'Google Cloud',
    gradient: { from: '#8AA7FF', via: '#5F86FF', to: '#3A5ACC' },
  },
  {
    src: framerLogo,
    alt: 'Framer',
    gradient: { from: '#67F0D1', via: '#2AE5B9', to: '#1B8F72' },
  },
]
