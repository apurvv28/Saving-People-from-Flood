export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

export interface TranslationSchema {
  nav: {
    brand: string;
    subTitle: string;
    backToLanding: string;
    openMeteoApi: string;
    liveWeather: string;
    maxDepth: string;
    reportWater: string;
    authorityCenter: string;
    authorityPortal: string;
    selectCity: string;
    selectEvent: string;
    lakes7: string;
    reservoirs5: string;
    yamunaStage: string;
  };
  landing: {
    leadTimeBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    metricLeadTime: string;
    metricHydraulics: string;
    metricPrecision: string;
    metricDetours: string;
    metricLeadTimeSub: string;
    metricHydraulicsSub: string;
    metricPrecisionSub: string;
    metricDetoursSub: string;
    selectCityTitle: string;
    selectCitySub: string;
    liveRadar: string;
    highRiskHotspots: string;
    authorityLoginDomain: string;
    launchDashboard: string;
    authorityLoginBtn: string;
    simTitle: string;
    simSub: string;
    simRainRate: string;
    moderate: string;
    heavy: string;
    cloudburst: string;
    predictedDepth: string;
    underpassLocation: string;
    capacityExceeded: string;
    capacityAdequate: string;
    faqTitle: string;
    faqBadge: string;
    faqMainHeading: string;
    footerTitle: string;
    footerSub: string;
    feature1Title: string;
    feature1Sub: string;
    feature2Title: string;
    feature2Sub: string;
    feature3Title: string;
    feature3Sub: string;
  };
  faqs: Array<{ q: string; a: string }>;
  routing: {
    title: string;
    subTitle: string;
    originPlaceholder: string;
    destPlaceholder: string;
    pickOrigin: string;
    pickDest: string;
    pinned: string;
    carSedan: string;
    ambulance: string;
    autoBike: string;
    pedestrian: string;
    findRoute: string;
    calculating: string;
    distance: string;
    eta: string;
    riskScore: string;
    riskSafe: string;
    riskModerate: string;
    riskHigh: string;
    riskImpassable: string;
    turnByTurn: string;
    noRouteFound: string;
    pickLocationPrompt: string;
    clearRoute: string;
    vehicleProfileClearance: string;
    maxSafe: string;
    hatchback: string;
    suv: string;
    bus: string;
    realRoadSafeRoute: string;
    noSafeRouteFor: string;
    selectHazardZone: string;
    nearestShelter: string;
    rescueVehicleRoute: string;
  };
  alerts: {
    title: string;
    subTitle: string;
    tabAll: string;
    tabInundation: string;
    tabSurcharge: string;
    tabReports: string;
    critical: string;
    warning: string;
    advisory: string;
    helplineTitle: string;
    ndrfHelpline: string;
    controlRoom: string;
    disasterLine: string;
    reportedAgo: string;
    verified: string;
    unverified: string;
    borough: string;
    elevation: string;
    overcapacity: string;
    surfaceSpill: string;
    hydraulicBackflow: string;
    noAlerts: string;
  };
  slider: {
    title: string;
    subTitle: string;
    play: string;
    pause: string;
    reset: string;
    nowLive: string;
    plusMin: string;
    plusHour: string;
    rainRateLabel: string;
    forecastDepthLabel: string;
  };
  reportModal: {
    title: string;
    subTitle: string;
    locationLabel: string;
    depthLabel: string;
    photoLabel: string;
    photoNote: string;
    obsLabel: string;
    obsPlaceholder: string;
    helpCheck: string;
    submitBtn: string;
    submitting: string;
    cancelBtn: string;
    successToast: string;
  };
  authModal: {
    title: string;
    subTitle: string;
    domainLabel: string;
    domainPlaceholder: string;
    passcodeLabel: string;
    passcodePlaceholder: string;
    loginBtn: string;
    loggingIn: string;
    demoNote: string;
    invalidCredentials: string;
  };
  dashboard: {
    title: string;
    subTitle: string;
    officerBadge: string;
    totalSubmerged: string;
    surchargingPipes: string;
    pumpsActive: string;
    exportSitRep: string;
    pumpControllerTitle: string;
    pumpStatus: string;
    activatePump: string;
    deactivatePump: string;
    groundTruthTitle: string;
    verifyBtn: string;
    dismissBtn: string;
    statusPending: string;
    statusVerified: string;
    statusDismissed: string;
    evacRouteBtn: string;
  };
  sitrep: {
    title: string;
    subTitle: string;
    generatePdf: string;
    downloadCsv: string;
    downloadJson: string;
    generating: string;
    summaryHeading: string;
    criticalZones: string;
  };
  tide: {
    title: string;
    highTideCountdown: string;
    nextHighTide: string;
    seaLevel: string;
    reservoirStorage: string;
    lakesRunway: string;
  };
  drainage: {
    title: string;
    undergroundGraph: string;
    coupledSurface: string;
    pipeDischarge: string;
    capacityUsage: string;
    criticalNodes: string;
  };
  map: {
    layers: string;
    basemapVector: string;
    basemapSat: string;
    inundationMesh: string;
    pipeGraph: string;
    citizenReports: string;
    legendTitle: string;
    depthSafe: string;
    depthModerate: string;
    depthHigh: string;
    depthSevere: string;
    surchargingNode: string;
    safeRoute: string;
    popupRoad: string;
    popupDepth: string;
    popupStatus: string;
    popupPassable: string;
    popupImpassable: string;
  };
  evacuationModal: {
    title: string;
    subTitle: string;
    selectVehicle: string;
    hazardZone: string;
    shelterHeading: string;
    elevationGain: string;
    stepByStepHeading: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    deployMapBtn: string;
    closeBtn: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  en: {
    nav: {
      brand: 'AquaAlert',
      subTitle: 'Public Citizen Urban Flood Nowcasting Portal',
      backToLanding: 'Back to Landing Page',
      openMeteoApi: 'Open-Meteo API',
      liveWeather: 'Open-Meteo Live Weather',
      maxDepth: 'Max Depth',
      reportWater: 'Report Water',
      authorityCenter: 'Authority Command Center',
      authorityPortal: 'Authority Portal',
      selectCity: 'Select City',
      selectEvent: 'Select Rain Scenario',
      lakes7: '7 Lakes: 87%',
      reservoirs5: '5 Reservoirs: 82%',
      yamunaStage: 'Yamuna Stage: 204.8m',
    },
    landing: {
      leadTimeBadge: '0–3 Hour Forward-Looking Lead Time',
      heroTitle: 'Coupled Surface & Subterranean Urban Flood Intelligence',
      heroSubtitle: 'Predict street-level water depths, manhole surcharge backflows, and generate flood-safe emergency transit routes in real-time.',
      metricLeadTime: '0–3 h',
      metricHydraulics: '1D + 2D',
      metricPrecision: 'Street-Level',
      metricDetours: '100%',
      metricLeadTimeSub: 'Forecast Lead Time',
      metricHydraulicsSub: 'Coupled Hydraulics',
      metricPrecisionSub: 'Depth Precision (cm)',
      metricDetoursSub: 'Dynamic Safe Detours',
      selectCityTitle: 'Select Metro City Command Center',
      selectCitySub: 'Choose a city below to open its live interactive GIS flood dashboard',
      liveRadar: 'Live Radar',
      highRiskHotspots: 'High-Risk Micro-Hotspots:',
      authorityLoginDomain: 'Authority Login:',
      launchDashboard: 'Launch Dashboard',
      authorityLoginBtn: 'Authority Login',
      simTitle: 'Interactive Hydraulic Runoff Simulator Preview',
      simSub: 'Adjust rainfall intensity to test predicted street inundation and drainage response',
      simRainRate: 'Simulated Rain Rate:',
      moderate: 'Moderate (15 mm/h)',
      heavy: 'Heavy (45 mm/h)',
      cloudburst: 'Cloudburst (85 mm/h)',
      predictedDepth: 'Predicted Street Water Depth:',
      underpassLocation: 'at low elevation underpass',
      capacityExceeded: '⚠️ Drainage pipe capacity exceeded (>100%). Manhole backflow surcharging onto surface.',
      capacityAdequate: '✅ Drainage network capacity adequate. Water flowing via gravity.',
      faqTitle: 'Frequently Asked Questions',
      faqBadge: 'Frequently Asked Questions',
      faqMainHeading: 'Everything You Need to Know About AquaAlert',
      footerTitle: 'AquaAlert • Urban Flood Hydro-Dynamic Prediction System',
      footerSub: 'Ministry of Earth Sciences (MoES) • National Centre for Medium Range Weather Forecasting (NCMRWF)',
      feature1Title: 'Coupled 1D + 2D Hydraulics',
      feature1Sub: 'Integrates Doppler radar rain nowcasts with 2D DEM surface runoff & 1D subterranean pipe graphs.',
      feature2Title: 'Flood-Safe Navigation API',
      feature2Sub: 'Reroutes ambulances, sedans, & rescue vehicles around submerged underpasses in real-time.',
      feature3Title: 'Municipal SitRep Exporter',
      feature3Sub: 'Empowers disaster management teams with SCADA pump controls & official PDF briefings.',
    },
    faqs: [
      {
        q: 'What credentials do municipal authorities use to log in?',
        a: 'Official municipal control room officers log in using their city authority domain: cityname.aqua.gov.in (e.g., mumbai.aqua.gov.in, delhi.aqua.gov.in, chennai.aqua.gov.in) with passcode: 12345678. Authority access unlocks 1D subterranean drainage telemetry, outfall dewatering pump controls, and executive SitRep PDF generators.'
      },
      {
        q: 'How does AquaAlert predict street flooding 0–3 hours in advance?',
        a: 'Traditional weather models only forecast volume of rain. AquaAlert couples live Doppler Radar rainfall nowcasts with a 2D Digital Elevation Model (DEM) and a 1D directed graph representation of subterranean stormwater drains to pinpoint street inundation depths in centimeters.'
      },
      {
        q: 'Which Indian metropolitan cities are currently active?',
        a: 'AquaAlert currently features high-resolution spatial models for Mumbai (Hindmata, Dadar, Kurla, Andheri), Delhi NCR (Minto Bridge, ITO Junction, Pul Prahladpur), and Chennai (Velachery, T. Nagar, Saidapet).'
      },
      {
        q: 'How does the Flood-Safe Emergency Navigation API work?',
        a: 'Standard navigation apps use static road speed limits. AquaAlert dynamically increases travel-time weights when predicted water depth exceeds vehicle clearance thresholds (e.g., >15cm for sedans, >25cm for ambulances), routing vehicles safely around flooded underpasses.'
      },
      {
        q: 'How can citizens contribute ground-truth report corrections?',
        a: 'Citizens and ground volunteers can tap "Report Water" to submit local water depth observations, location tags, and ground photos.'
      }
    ],
    routing: {
      title: 'Flood-Safe Emergency Route Planner',
      subTitle: 'Calculates dynamic flood-avoidance transit pathways updated against live hydrodynamic forecast',
      originPlaceholder: 'Starting Location / Current GPS',
      destPlaceholder: 'Destination Address / Hospital / Shelter',
      pickOrigin: 'Pin Origin',
      pickDest: 'Pin Destination',
      pinned: 'Pinned on map',
      carSedan: 'Car / Sedan',
      ambulance: 'Ambulance (Emergency)',
      autoBike: 'Auto / Bike',
      pedestrian: 'Pedestrian (Walking)',
      findRoute: 'Calculate Safe Route',
      calculating: 'Calculating Dynamic Route...',
      distance: 'Distance',
      eta: 'Est. Transit Time',
      riskScore: 'Route Risk',
      riskSafe: 'Safe Route (0-10cm)',
      riskModerate: 'Moderate Inundation (10-25cm)',
      riskHigh: 'High Risk (25-45cm)',
      riskImpassable: 'Impassable (>45cm)',
      turnByTurn: 'Turn-by-Turn Safe Navigation',
      noRouteFound: 'No safe route found matching clearance limits. Please select alternative points.',
      pickLocationPrompt: 'Click on the map to set location',
      clearRoute: 'Clear Route',
      vehicleProfileClearance: 'Vehicle Profile & Clearance:',
      maxSafe: 'Max Safe:',
      hatchback: 'Hatchback',
      suv: 'SUV 4x4',
      bus: 'Bus / Heavy Vehicle',
      realRoadSafeRoute: 'AquaAlert Real Road Flood-Safe Route',
      noSafeRouteFor: 'NO SAFE ROUTE FOR',
      selectHazardZone: 'Select Flood Hazard Zone:',
      nearestShelter: 'Nearest Safe Assembly Shelter',
      rescueVehicleRoute: 'Rescue Vehicle Route',
    },
    alerts: {
      title: 'Live Hazard Alerts',
      subTitle: 'Real-time inundation & drainage surcharge notifications',
      tabAll: 'All Alerts',
      tabInundation: 'Street Flooding',
      tabSurcharge: 'Pipe Surcharge',
      tabReports: 'Citizen Reports',
      critical: 'CRITICAL',
      warning: 'WARNING',
      advisory: 'ADVISORY',
      helplineTitle: 'Emergency Disaster Helplines',
      ndrfHelpline: 'NDRF Control Room',
      controlRoom: 'Municipal Control Room',
      disasterLine: 'Disaster Emergency Line',
      reportedAgo: 'mins ago',
      verified: 'Verified by Control Room',
      unverified: 'Citizen Unverified',
      borough: 'Borough',
      elevation: 'Elevation',
      overcapacity: 'OVERCAPACITY',
      surfaceSpill: 'SURFACE SPILL',
      hydraulicBackflow: 'Hydraulic Backflow',
      noAlerts: 'No critical flood bottlenecks predicted for this time lead.',
    },
    slider: {
      title: '0–3 Hour Flood Inundation Forecast Scrubber',
      subTitle: 'Scrub timeline to preview hydro-dynamic street flooding evolution',
      play: 'Play Simulation',
      pause: 'Pause Simulation',
      reset: 'Reset to Now',
      nowLive: 'NOW (Live)',
      plusMin: 'min',
      plusHour: 'hr',
      rainRateLabel: 'Rain Intensity:',
      forecastDepthLabel: 'Max Inundation:',
    },
    reportModal: {
      title: 'Report Water Depth & Flooding',
      subTitle: 'Help municipal control rooms verify real-time street inundation',
      locationLabel: 'Location / Landmark',
      depthLabel: 'Observed Water Depth (cm)',
      photoLabel: 'Upload Photo Observation (Optional)',
      photoNote: 'Click or drag photo of flooded street',
      obsLabel: 'Additional Details',
      obsPlaceholder: 'Mention stranded vehicles, blocked drains, or emergency shelter requests...',
      helpCheck: 'Emergency Assistance Needed Immediately',
      submitBtn: 'Submit Ground Report',
      submitting: 'Submitting Report...',
      cancelBtn: 'Cancel',
      successToast: 'Report submitted successfully to municipal control center!',
    },
    authModal: {
      title: 'Disaster Management Officer Login',
      subTitle: 'Access subterranean 1D telemetry, dewatering pumps, and SitRep exporter',
      domainLabel: 'Authority Login Domain / ID',
      domainPlaceholder: 'e.g. mumbai.aqua.gov.in',
      passcodeLabel: 'Official Access Passcode',
      passcodePlaceholder: 'Enter 8-digit passcode',
      loginBtn: 'Sign In to Command Center',
      loggingIn: 'Authenticating Credentials...',
      demoNote: 'Demo Official Passcode for all cities:',
      invalidCredentials: 'Invalid authority login domain or passcode. Use demo passcode 12345678.',
    },
    dashboard: {
      title: 'Disaster Management Command Center',
      subTitle: 'Real-time municipal flood telemetry, pump control & emergency evacuation',
      officerBadge: 'Active Officer:',
      totalSubmerged: 'Submerged Road Segments',
      surchargingPipes: 'Surcharging Drain Pipe Nodes',
      pumpsActive: 'Dewatering Pumps Active',
      exportSitRep: 'Export SitRep PDF / CSV',
      pumpControllerTitle: 'Dewatering Pump Station Operations',
      pumpStatus: 'Pump Status',
      activatePump: 'Activate Pump (1500 L/s)',
      deactivatePump: 'Standby Mode',
      groundTruthTitle: 'Ground-Truth Citizen Reports Verification',
      verifyBtn: 'Verify & Dispatch',
      dismissBtn: 'Dismiss Report',
      statusPending: 'Pending Review',
      statusVerified: 'Verified & Actioned',
      statusDismissed: 'Dismissed',
      evacRouteBtn: 'Generate Evacuation Plan',
    },
    sitrep: {
      title: 'Situation Report (SitRep) Exporter',
      subTitle: 'Generate official hydro-dynamic flood status reports for executive briefings',
      generatePdf: 'Download SitRep PDF',
      downloadCsv: 'Export Telemetry CSV',
      downloadJson: 'Export Telemetry JSON',
      generating: 'Generating Executive Briefing...',
      summaryHeading: 'Executive Hydro-Dynamic Situation Summary',
      criticalZones: 'Primary High-Risk Zones:',
    },
    tide: {
      title: 'Tide & Waterbody Telemetry',
      highTideCountdown: 'Next High Tide In:',
      nextHighTide: 'Peak Surge Height:',
      seaLevel: 'Coastal Sea Level:',
      reservoirStorage: 'Key Reservoir Storage:',
      lakesRunway: 'Water Supply Runway:',
    },
    drainage: {
      title: 'Coupled Subterranean Drainage Graph',
      undergroundGraph: '1D Underground Storm Drain Network',
      coupledSurface: 'Coupled Surface DEM Runoff',
      pipeDischarge: 'Max Pipe Discharge Rate',
      capacityUsage: 'Network Capacity Utilization',
      criticalNodes: 'Surcharging Manhole Nodes',
    },
    map: {
      layers: 'Map Layers',
      basemapVector: 'Street Basemap',
      basemapSat: 'Satellite Basemap',
      inundationMesh: 'Flood Inundation Depth',
      pipeGraph: 'Drainage Pipe Network',
      citizenReports: 'Citizen Reports',
      legendTitle: 'Water Depth Legend',
      depthSafe: '< 10 cm (Passable)',
      depthModerate: '10 – 25 cm (Caution)',
      depthHigh: '25 – 45 cm (High Risk)',
      depthSevere: '> 45 cm (Impassable)',
      surchargingNode: 'Surcharging Manhole Backflow',
      safeRoute: 'Flood-Safe Detour Route',
      popupRoad: 'Road Segment:',
      popupDepth: 'Predicted Depth:',
      popupStatus: 'Status:',
      popupPassable: 'Passable for Vehicles',
      popupImpassable: 'Flooded - Avoid Route',
    },
    evacuationModal: {
      title: 'Emergency Evacuation & Guidance Plan',
      subTitle: 'Step-by-step transit route tailored to your vehicle & flood clearance limits',
      selectVehicle: 'Select Your Vehicle Profile:',
      hazardZone: 'Active Flood Hazard Zone',
      shelterHeading: 'Nearest Safe Assembly Shelter',
      elevationGain: 'Elevation Gain',
      stepByStepHeading: 'Step-by-Step Evacuation Transit Plan',
      step1Title: 'Step 1: Rapid Prep & Clearance Check',
      step2Title: 'Step 2: Restricted Submerged Corridor Avoidance',
      step3Title: 'Step 3: Turn-by-Turn Safe Transit Path',
      step4Title: 'Step 4: Arrival & Relief Center Check-In',
      deployMapBtn: 'Deploy Evacuation Route on GIS Map',
      closeBtn: 'Close Evacuation Plan',
    },
  },

  hi: {
    nav: {
      brand: 'AquaAlert',
      subTitle: 'नागरिक शहरी बाढ़ पूर्वाभास पोर्टल',
      backToLanding: 'मुख्य पृष्ठ पर लौटें',
      openMeteoApi: 'ओपन-मीटियो एपीआई',
      liveWeather: 'ओपन-मीटियो लाइव मौसम',
      maxDepth: 'अधिकतम गहराई',
      reportWater: 'जलभराव की रिपोर्ट करें',
      authorityCenter: 'प्राधिकरण कमांड सेंटर',
      authorityPortal: 'प्राधिकरण पोर्टल',
      selectCity: 'शहर चुनें',
      selectEvent: 'वर्षा परिदृश्य चुनें',
      lakes7: '7 झीलें: 87%',
      reservoirs5: '5 जलाशय: 82%',
      yamunaStage: 'यमुना का स्तर: 204.8m',
    },
    landing: {
      leadTimeBadge: '0–3 घंटे का अग्रिम पूर्वानुमान समय',
      heroTitle: 'सतही एवं भूमिगत एकीकृत शहरी बाढ़ खुफिया प्रणाली',
      heroSubtitle: 'सड़क स्तर पर पानी की गहराई, मैनहोल बैकफ़्लो और बाढ़-सुरक्षित आपातकालीन मार्गों का वास्तविक समय में पूर्वानुमान लगाएं।',
      metricLeadTime: '0–3 घंटे',
      metricHydraulics: '1D + 2D',
      metricPrecision: 'सड़क-स्तर',
      metricDetours: '100%',
      metricLeadTimeSub: 'पूर्वाभास समय',
      metricHydraulicsSub: 'एकीकृत हाइड्रोलिक्स',
      metricPrecisionSub: 'गहराई सटीकता (सेमी)',
      metricDetoursSub: 'डायनामिक सुरक्षित मार्ग',
      selectCityTitle: 'मेट्रो सिटी कमांड सेंटर चुनें',
      selectCitySub: 'लाइव इंटरैक्टिव जीआईएस बाढ़ डैशबोर्ड खोलने के लिए नीचे एक शहर चुनें',
      liveRadar: 'लाइव रडार',
      highRiskHotspots: 'उच्च जोखिम वाले क्षेत्र:',
      authorityLoginDomain: 'प्राधिकरण लॉगिन:',
      launchDashboard: 'डैशबोर्ड खोलें',
      authorityLoginBtn: 'प्राधिकरण लॉगिन',
      simTitle: 'इंटरैक्टिव हाइड्रोलिक रनऑफ सिम्युलेटर पूर्वावलोकन',
      simSub: 'सड़क जलभराव और ड्रेनेज प्रतिक्रिया का परीक्षण करने के लिए वर्षा की तीव्रता समायोजित करें',
      simRainRate: 'सिम्युलेटेड वर्षा दर:',
      moderate: 'मध्यम (15 मिमी/घंटा)',
      heavy: 'भारी (45 मिमी/घंटा)',
      cloudburst: 'बादल फटना (85 मिमी/घंटा)',
      predictedDepth: 'अनुमानित सड़क जल गहराई:',
      underpassLocation: 'निचले अंडरपास पर',
      capacityExceeded: '⚠️ ड्रेनेज पाइप क्षमता से अधिक (>100%)। सतह पर ओवरफ़्लो।',
      capacityAdequate: '✅ ड्रेनेज नेटवर्क क्षमता पर्याप्त है। पानी गुरुत्वाकर्षण द्वारा बह रहा है।',
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqBadge: 'अक्सर पूछे जाने वाले प्रश्न',
      faqMainHeading: 'AquaAlert के बारे में वह सब कुछ जो आपको जानना आवश्यक है',
      footerTitle: 'AquaAlert • शहरी बाढ़ हाइड्रो-डायनामिक पूर्वानुमान प्रणाली',
      footerSub: 'पृथ्वी विज्ञान मंत्रालय (MoES) • राष्ट्रीय मध्यम अवधि मौसम पूर्वानुमान केंद्र (NCMRWF)',
      feature1Title: 'एकीकृत 1D + 2D हाइड्रोलिक्स',
      feature1Sub: 'डॉपलर रडार वर्षा पूर्वानुमान को 2D सतही पानी और 1D भूमिगत नाले के नेटवर्क के साथ जोड़ता है।',
      feature2Title: 'बाढ़-सुरक्षित नेविगेशन एपीआई',
      feature2Sub: 'जलमग्न रास्तों और अंडरपास से बचाकर एम्बुलेंस और वाहनों को सुरक्षित री-रूट करता है।',
      feature3Title: 'आपदा रिपोर्ट (SitRep) निर्यातक',
      feature3Sub: 'आपदा प्रबंधन टीमों को पंप नियंत्रण और आधिकारिक रिपोर्ट डाउनलोड की सुविधा देता है।',
    },
    faqs: [
      {
        q: 'नगर निगम अधिकारी लॉगिन करने के लिए किन क्रेडेंशियल्स का उपयोग करते हैं?',
        a: 'आधिकारिक नगर निगम नियंत्रण कक्ष अधिकारी अपने शहर प्राधिकरण डोमेन का उपयोग करके लॉगिन करते हैं: cityname.aqua.gov.in (जैसे, mumbai.aqua.gov.in, delhi.aqua.gov.in, chennai.aqua.gov.in) पासकोड: 12345678 के साथ।'
      },
      {
        q: 'AquaAlert 0–3 घंटे पहले सड़क जलभराव का पूर्वानुमान कैसे लगाता है?',
        a: 'पारंपरिक मौसम मॉडल केवल वर्षा की मात्रा का अनुमान लगाते हैं। AquaAlert लाइव डॉपलर रडार वर्षा को 2D डिजिटल एलिवेशन मॉडल (DEM) और 1D भूमिगत नाले के नेटवर्क के साथ जोड़ता है।'
      },
      {
        q: 'वर्तमान में कौन से भारतीय महानगर सक्रिय हैं?',
        a: 'AquaAlert वर्तमान में मुंबई (हिंदमाता, दादर, कुर्ला, अंधेरी), दिल्ली एनसीआर (मिंटो ब्रिज, आईटीओ, पुल प्रह्लादपुर) और चेन्नई (वेलाचेरी, टी. नगर, सैदापेट) के लिए लाइव मॉडल प्रदान करता है।'
      },
      {
        q: 'बाढ़-सुरक्षित आपातकालीन नेविगेशन एपीआई कैसे काम करता है?',
        a: 'सामान्य नेविगेशन ऐप स्थिर सड़क गति सीमाओं का उपयोग करते हैं। AquaAlert जलभराव गहराई के आधार पर वाहनों को जलमग्न इलाकों से सुरक्षित दूर री-रूट करता है।'
      },
      {
        q: 'नागरिक धरातलीय रिपोर्टिंग में कैसे योगदान दे सकते हैं?',
        a: 'नागरिक और स्वयंसेवक "जलभराव रिपोर्ट" पर टैप करके पानी की गहराई, स्थान और तस्वीरें सबमिट कर सकते हैं।'
      }
    ],
    routing: {
      title: 'बाढ़-सुरक्षित आपातकालीन मार्ग योजनाकार',
      subTitle: 'लाइव हाइड्रोडायनामिक पूर्वानुमान के आधार पर सुरक्षित मार्ग की गणना करता है',
      originPlaceholder: 'प्रारंभिक स्थान / वर्तमान जीपीएस',
      destPlaceholder: 'गंतव्य पता / अस्पताल / आश्रय',
      pickOrigin: 'मानचित्र पर प्रारंभ चुनें',
      pickDest: 'मानचित्र पर गंतव्य चुनें',
      pinned: 'मानचित्र पर चयनित',
      carSedan: 'कार / सेडान',
      ambulance: 'एंबुलेंस (आपातकालीन)',
      autoBike: 'ऑटो / बाइक',
      pedestrian: 'पैदल (वॉक)',
      findRoute: 'सुरक्षित मार्ग खोजें',
      calculating: 'सुरक्षित मार्ग की गणना जारी...',
      distance: 'दूरी',
      eta: 'अनुमानित समय',
      riskScore: 'मार्ग जोखिम',
      riskSafe: 'सुरक्षित मार्ग (0-10 सेमी)',
      riskModerate: 'मध्यम जलभराव (10-25 सेमी)',
      riskHigh: 'उच्च जोखिम (25-45 सेमी)',
      riskImpassable: 'अगम्य (>45 सेमी)',
      turnByTurn: 'सुरक्षित मोड़-दर-मोड़ नेविगेशन',
      noRouteFound: 'वाहन की सीमा से मेल खाता कोई सुरक्षित मार्ग नहीं मिला। वैकल्पिक बिंदु चुनें।',
      pickLocationPrompt: 'स्थान सेट करने के लिए मानचित्र पर क्लिक करें',
      clearRoute: 'मार्ग साफ़ करें',
      vehicleProfileClearance: 'वाहन प्रोफ़ाइल एवं जल क्षमता:',
      maxSafe: 'अधिकतम सुरक्षित:',
      hatchback: 'हैचबैक',
      suv: 'एसयूवी 4x4',
      bus: 'बस / भारी वाहन',
      realRoadSafeRoute: 'AquaAlert रियल रोड बाढ़-सुरक्षित मार्ग',
      noSafeRouteFor: 'इसके लिए कोई सुरक्षित मार्ग नहीं:',
      selectHazardZone: 'बाढ़ जोखिम क्षेत्र चुनें:',
      nearestShelter: 'निकटतम सुरक्षित राहत शिविर',
      rescueVehicleRoute: 'बचाव वाहन मार्ग',
    },
    alerts: {
      title: 'लाइव आपदा अलर्ट',
      subTitle: 'वास्तविक समय में जलभराव और ड्रेनेज ओवरफ़्लो अलर्ट',
      tabAll: 'सभी अलर्ट',
      tabInundation: 'सड़क जलभराव',
      tabSurcharge: 'पाइप ओवरफ़्लो',
      tabReports: 'नागरिक रिपोर्ट',
      critical: 'गंभीर',
      warning: 'चेतावनी',
      advisory: 'सलाहकार',
      helplineTitle: 'आपातकालीन आपदा हेल्पलाइन',
      ndrfHelpline: 'एनडीआरएफ कंट्रोल रूम',
      controlRoom: 'नगर निगम कंट्रोल रूम',
      disasterLine: 'आपदा आपातकालीन नंबर',
      reportedAgo: 'मिनट पहले',
      verified: 'कंट्रोल रूम द्वारा सत्यापित',
      unverified: 'नागरिक रिपोर्ट (असत्यापित)',
      borough: 'प्रभाग / क्षेत्र',
      elevation: 'ऊंचाई',
      overcapacity: 'क्षमता से अधिक',
      surfaceSpill: 'सतही ओवरफ़्लो',
      hydraulicBackflow: 'हाइड्रोलिक बैकफ़्लो',
      noAlerts: 'इस समय अंतराल के लिए कोई गंभीर जलभराव अनुमानित नहीं है।',
    },
    slider: {
      title: '0–3 घंटे का जलभराव पूर्वाभास टाइमलाइन',
      subTitle: 'जलभराव का पूर्वावलोकन करने के लिए टाइमलाइन स्लाइड करें',
      play: 'सिम्युलेशन चलाएं',
      pause: 'रोकें',
      reset: 'वर्तमान समय',
      nowLive: 'अभी (लाइव)',
      plusMin: 'मिनट',
      plusHour: 'घंटा',
      rainRateLabel: 'वर्षा की तीव्रता:',
      forecastDepthLabel: 'अधिकतम जलभराव:',
    },
    reportModal: {
      title: 'जलभराव की रिपोर्ट दर्ज करें',
      subTitle: 'नगर निगम को वास्तविक समय की जानकारी प्रदान करने में सहायता करें',
      locationLabel: 'स्थान / प्रमुख स्थल',
      depthLabel: 'अनुमानित पानी की गहराई (सेमी)',
      photoLabel: 'तस्वीर अपलोड करें (वैकल्पिक)',
      photoNote: 'जलभराव की तस्वीर क्लिक करें या ड्रैग करें',
      obsLabel: 'अतिरिक्त विवरण',
      obsPlaceholder: 'फंसे हुए वाहन, अवरुद्ध नाले, या आपातकालीन सहायता का उल्लेख करें...',
      helpCheck: 'तुरंत आपातकालीन सहायता की आवश्यकता है',
      submitBtn: 'रिपोर्ट जमा करें',
      submitting: 'रिपोर्ट भेजी जा रही है...',
      cancelBtn: 'रद्द करें',
      successToast: 'रिपोर्ट सफलतापूर्वक नगर निगम कंट्रोल रूम को भेज दी गई!',
    },
    authModal: {
      title: 'आपदा प्रबंधन अधिकारी लॉगिन',
      subTitle: 'भूमिगत टेलीमेट्री, पंप नियंत्रण और रिपोर्ट जनरेटर तक पहुंचें',
      domainLabel: 'प्राधिकरण लॉगिन डोमेन / आईडी',
      domainPlaceholder: 'उदा. mumbai.aqua.gov.in',
      passcodeLabel: 'आधिकारिक एक्सेस पासकोड',
      passcodePlaceholder: '8-अंकीय पासकोड दर्ज करें',
      loginBtn: 'कमांड सेंटर में साइन इन करें',
      loggingIn: 'प्रमाणीकरण जारी...',
      demoNote: 'सभी शहरों के लिए डेमो पासकोड:',
      invalidCredentials: 'अमान्य डोमेन या पासकोड। डेमो पासकोड 12345678 का उपयोग करें।',
    },
    dashboard: {
      title: 'आपदा प्रबंधन कमांड सेंटर',
      subTitle: 'वास्तविक समय नगर निगम बाढ़ टेलीमेट्री और पंप नियंत्रण',
      officerBadge: 'सक्रिय अधिकारी:',
      totalSubmerged: 'जलमग्न सड़क खंड',
      surchargingPipes: 'ओवरफ्लो हो रहे नाले',
      pumpsActive: 'सक्रिय डिवाटरिंग पंप',
      exportSitRep: 'SitRep रिपोर्ट डाउनलोड करें',
      pumpControllerTitle: 'डिवाटरिंग पंप स्टेशन संचालन',
      pumpStatus: 'पंप स्थिति',
      activatePump: 'पंप चालू करें (1500 L/s)',
      deactivatePump: 'स्टैंडबाय मोड',
      groundTruthTitle: 'नागरिक रिपोर्ट सत्यापन',
      verifyBtn: 'सत्यापित करें और कार्रवाई करें',
      dismissBtn: 'खारिज करें',
      statusPending: 'समीक्षा लंबित',
      statusVerified: 'सत्यापित और कार्यवाही की गई',
      statusDismissed: 'खारिज',
      evacRouteBtn: 'निकासी योजना बनाएं',
    },
    sitrep: {
      title: 'स्थिति रिपोर्ट (SitRep) निर्यातक',
      subTitle: 'उच्च अधिकारियों के लिए आधिकारिक बाढ़ स्थिति रिपोर्ट बनाएं',
      generatePdf: 'SitRep PDF डाउनलोड करें',
      downloadCsv: 'टेलीमेट्री CSV निर्यात करें',
      downloadJson: 'टेलीमेट्री JSON निर्यात करें',
      generating: 'रिपोर्ट तैयार हो रही है...',
      summaryHeading: 'कार्यकारी बाढ़ स्थिति सारांश',
      criticalZones: 'मुख्य उच्च जोखिम वाले क्षेत्र:',
    },
    tide: {
      title: 'ज्वार और जल निकाय टेलीमेट्री',
      highTideCountdown: 'अगला उच्च ज्वार समय:',
      nextHighTide: 'उच्चतम ज्वार ऊंचाई:',
      seaLevel: 'समुद्र तल का स्तर:',
      reservoirStorage: 'प्रमुख जलाशय भंडारण:',
      lakesRunway: 'जल आपूर्ति रनवे:',
    },
    drainage: {
      title: 'भूमिगत ड्रेनेज नेटवर्क',
      undergroundGraph: '1D भूमिगत तूफान नाला नेटवर्क',
      coupledSurface: 'सतही रनऑफ',
      pipeDischarge: 'अधिकतम डिस्चार्ज दर',
      capacityUsage: 'नेटवर्क क्षमता उपयोग',
      criticalNodes: 'ओवरफ्लो हो रहे नाले',
    },
    map: {
      layers: 'मानचित्र परतें',
      basemapVector: 'सड़क मानचित्र',
      basemapSat: 'सैटेलाइट मानचित्र',
      inundationMesh: 'जलभराव गहराई',
      pipeGraph: 'ड्रेनेज पाइप नेटवर्क',
      citizenReports: 'नागरिक रिपोर्ट',
      legendTitle: 'पानी की गहराई का संकेत',
      depthSafe: '< 10 सेमी (सुरक्षित)',
      depthModerate: '10 – 25 सेमी (सावधानी)',
      depthHigh: '25 – 45 सेमी (उच्च जोखिम)',
      depthSevere: '> 45 सेमी (अगम्य)',
      surchargingNode: 'मैनहोल ओवरफ्लो',
      safeRoute: 'सुरक्षित वैकल्पिक मार्ग',
      popupRoad: 'सड़क खंड:',
      popupDepth: 'अनुमानित गहराई:',
      popupStatus: 'स्थिति:',
      popupPassable: 'वाहनों के लिए योग्य',
      popupImpassable: 'जलमग्न - मार्ग से बचें',
    },
    evacuationModal: {
      title: 'आपातकालीन निकासी एवं मार्गदर्शन योजना',
      subTitle: 'आपकी वाहन क्षमता के आधार पर चरण-दर-चरण सुरक्षित मार्ग निर्देश',
      selectVehicle: 'अपना वाहन प्रकार चुनें:',
      hazardZone: 'सक्रिय बाढ़ जोखिम क्षेत्र',
      shelterHeading: 'निकटतम सुरक्षित राहत शिविर',
      elevationGain: 'ऊंचाई लाभ',
      stepByStepHeading: 'चरण-दर-चरण निकासी योजना',
      step1Title: 'चरण 1: त्वरित तैयारी एवं जल निकासी सीमा जांच',
      step2Title: 'चरण 2: जलमग्न रास्तों और अंडरपास से बचाव',
      step3Title: 'चरण 3: मोड़-दर-मोड़ सुरक्षित मार्ग निर्देश',
      step4Title: 'चरण 4: राहत केंद्र में आगमन और सहायता पंजीकरण',
      deployMapBtn: 'जीआईएस मानचित्र पर सुरक्षित मार्ग चालू करें',
      closeBtn: 'योजना बंद करें',
    },
  },

  mr: {
    nav: {
      brand: 'AquaAlert',
      subTitle: 'नागरी पूर पूर्वसूचना पोर्टल',
      backToLanding: 'मुख्य पृष्ठावर जा',
      openMeteoApi: 'ओपन-मिशिओ एपीआय',
      liveWeather: 'लाइव्ह हवामान',
      maxDepth: 'कमाल खोली',
      reportWater: 'पाण्याची नोंद करा',
      authorityCenter: 'प्राधिकरण कमांड सेंटर',
      authorityPortal: 'प्राधिकरण पोर्टल',
      selectCity: 'शहर निवडा',
      selectEvent: 'पाऊस प्रकार निवडा',
      lakes7: '7 तलाव: 87%',
      reservoirs5: '5 जलाशय: 82%',
      yamunaStage: 'यमुना पातळी: 204.8m',
    },
    landing: {
      leadTimeBadge: '0–3 तास आगाऊ अंदाज वेळ',
      heroTitle: 'पृष्ठभाग आणि भूगर्भातील एकात्मिक पूर बुद्धिमत्ता',
      heroSubtitle: 'रस्त्यावरील पाण्याची खोली, मॅनहोलचे पाठीमागचे पाणी आणि पूर-सुरक्षित आपत्कालीन मार्गांचा रिअल-टाइम अंदाज लावा.',
      metricLeadTime: '0–3 तास',
      metricHydraulics: '1D + 2D',
      metricPrecision: 'रस्ता-पातळी',
      metricDetours: '100%',
      metricLeadTimeSub: 'पूर्वसूचना वेळ',
      metricHydraulicsSub: 'एकात्मिक हायड्रोलिक्स',
      metricPrecisionSub: 'खोली अचूकता (सेमी)',
      metricDetoursSub: 'डायनॅमिक सुरक्षित मार्ग',
      selectCityTitle: 'मेट्रो सिटी कमांड सेंटर निवडा',
      selectCitySub: 'जीआयएस पूर माहितीपट पाहण्यासाठी खालील शहर निवडा',
      liveRadar: 'लाइव्ह रडार',
      highRiskHotspots: 'उच्च धोक्याची क्षेत्रे:',
      authorityLoginDomain: 'प्राधिकरण लॉगिन:',
      launchDashboard: 'डॅशबोर्ड उघडा',
      authorityLoginBtn: 'प्राधिकरण लॉगिन',
      simTitle: 'इंटरॅक्टिव्ह पावसाचे पाणी सिम्युलेटर',
      simSub: 'रस्त्यावरील पाण्याचा अंदाज तपासण्यासाठी पावसाची तीव्रता बदला',
      simRainRate: 'सिम्युलेटेड पाऊस दर:',
      moderate: 'मध्यम (15 मिमी/तास)',
      heavy: 'मुसळधार (45 मिमी/तास)',
      cloudburst: 'ढगफुटी (85 मिमी/तास)',
      predictedDepth: 'अंदाजित पाण्याची खोली:',
      underpassLocation: 'सखल सबवे येथे',
      capacityExceeded: '⚠️ ड्रेनेज क्षमतेपेक्षा जास्त (>100%). रस्त्यावर पाण्याचा फुगवटा.',
      capacityAdequate: '✅ ड्रेनेज क्षमता पुरेशी आहे.',
      faqTitle: 'सतत विचारले जाणारे प्रश्न',
      faqBadge: 'महत्त्वाचे प्रश्न',
      faqMainHeading: 'AquaAlert बद्दल सर्व काही',
      footerTitle: 'AquaAlert • नागरी पूर हायड्रो-डायनॅमिक अंदाज प्रणाली',
      footerSub: 'पृथ्वी विज्ञान मंत्रालय (MoES) • राष्ट्रीय मध्यम कालावधी हवामान अंदाज केंद्र (NCMRWF)',
      feature1Title: 'एकात्मिक 1D + 2D हायड्रोलिक्स',
      feature1Sub: 'डॉपलर रडारचा पाऊस अंदाज, 2D रस्ता पातळी व 1D भूगर्भातील गटार नेटवर्क एकत्र करतो.',
      feature2Title: 'पूर-सुरक्षित नेव्हिगेशन एपीआई',
      feature2Sub: 'पाण्याखालील रस्ते व सबवे टाळून वाहनांना सुरक्षित वळणावर री-रूट करतो.',
      feature3Title: 'आपत्ती अहवाल (SitRep) निर्यातक',
      feature3Sub: 'आपत्ती व्यवस्थापन टीमला पंप नियंत्रण व अधिकृत अहवाल डाउनलोड सुविधा देतो.',
    },
    faqs: [
      {
        q: 'महापालिका अधिकारी लॉगिन कसे करतात?',
        a: 'अधिकृत अधिकारी त्यांच्या शहर डोमेनने (उदा. mumbai.aqua.gov.in) आणि पासकोड 12345678 वापरून लॉगिन करतात.'
      },
      {
        q: 'AquaAlert 0–3 तास आधी पुराचा अंदाज कसा लावतो?',
        a: 'AquaAlert थेट डॉपलर रडार, 2D डिजिटल एलिव्हेशन मॉडेल (DEM) आणि 1D भूगर्भातील गटार नेटवर्क एकत्र करून अचूक अंदाज देतो.'
      },
      {
        q: 'कोणती भारतीय शहरे समाविष्ट आहेत?',
        a: 'मुंबई (हिंदमाता, दादर, कुर्ला, अंधेरी), दिल्ली एनसीआर (मिंटो ब्रिज, आयटीओ) आणि चेन्नई (वेलाचेरी, टी नगर).'
      },
      {
        q: 'सुरक्षित नेव्हिगेशन कसे कार्य करते?',
        a: 'AquaAlert पाण्याच्या खोलीनुसार वाहनांना पुराच्या भागातून सुरक्षित वळणावर री-रूट करतो.'
      },
      {
        q: 'नागरिक माहिती कशी सादर करू शकतात?',
        a: '"पाण्याची नोंद करा" बटणावर क्लिक करून नागरिक फोटो आणि खोली नोंदवू शकतात.'
      }
    ],
    routing: {
      title: 'पूर-सुरक्षित आपत्कालीन मार्ग नियोजक',
      subTitle: 'लाइव्ह पुराच्या अंदाजानुसार सुरक्षित मार्ग शोधतो',
      originPlaceholder: 'सुरुवातीचे ठिकाण / वर्तमान स्थान',
      destPlaceholder: 'गंतव्य स्थान / रुग्णालय / निवारा',
      pickOrigin: 'नकाशावर निवडा',
      pickDest: 'गंतव्य निवडा',
      pinned: 'नकाशावर निश्चित केले',
      carSedan: 'कार / सेडान',
      ambulance: 'ॲम्ब्युलन्स (आपत्कालीन)',
      autoBike: 'रिक्षा / बाईक',
      pedestrian: 'पायी (वॉक)',
      findRoute: 'सुरक्षित मार्ग शोधा',
      calculating: 'मार्ग शोधत आहे...',
      distance: 'अंतर',
      eta: 'अंदाजित वेळ',
      riskScore: 'मार्ग धोका',
      riskSafe: 'सुरक्षित मार्ग (0-10 सेमी)',
      riskModerate: 'मध्यम पाणी (10-25 सेमी)',
      riskHigh: 'उच्च धोका (25-45 सेमी)',
      riskImpassable: 'अगम्य (>45 सेमी)',
      turnByTurn: 'सुरक्षित वळण-दर-वळण मार्गदर्शन',
      noRouteFound: 'सुरक्षित मार्ग सापडला नाही. कृपया इतर ठिकाण निवडा.',
      pickLocationPrompt: 'स्थान निवडण्यासाठी नकाशावर क्लिक करा',
      clearRoute: 'मार्ग हटवा',
      vehicleProfileClearance: 'वाहन प्रोफाइल आणि जल क्षमता:',
      maxSafe: 'कमाल सुरक्षित:',
      hatchback: 'हॅचबॅक',
      suv: 'एसयूव्ही 4x4',
      bus: 'बस / अवजड वाहन',
      realRoadSafeRoute: 'AquaAlert रिअल रोड पूर-सुरक्षित मार्ग',
      noSafeRouteFor: 'या वाहनासाठी सुरक्षित मार्ग उपलब्ध नाही:',
      selectHazardZone: 'पूर धोक्याचा भाग निवडा:',
      nearestShelter: 'जवळचे सुरक्षित आपत्कालीन निवारा केंद्र',
      rescueVehicleRoute: 'बचाव वाहन मार्ग',
    },
    alerts: {
      title: 'लाइव्ह आपत्कालीन इशारे',
      subTitle: 'रिअल-टाइम पाणी साचणे व ड्रेनेज ओव्हरफ्लो सूचना',
      tabAll: 'सर्व इशारे',
      tabInundation: 'रस्त्यावरील पाणी',
      tabSurcharge: 'गटार ओव्हरफ्लो',
      tabReports: 'नागरिक नोंदी',
      critical: 'अतिधोकादायक',
      warning: 'इशारा',
      advisory: 'सूचना',
      helplineTitle: 'आपत्कालीन मदत क्रमांक',
      ndrfHelpline: 'एनडीआरएफ नियंत्रण कक्ष',
      controlRoom: 'महापालिका नियंत्रण कक्ष',
      disasterLine: 'आपत्ती व्यवस्थापन हेल्पलाइन',
      reportedAgo: 'मिनिटांपूर्वी',
      verified: 'नियंत्रण कक्षाद्वारे सत्यापित',
      unverified: 'नागरिक नोंद (अतपासलेली)',
      borough: 'विभाग / भाग',
      elevation: 'उंची',
      overcapacity: 'क्षमेतेपेक्षा जास्त',
      surfaceSpill: 'रस्त्यावर पाण्याचा फुगवटा',
      hydraulicBackflow: 'गटार बॅकफ्लो',
      noAlerts: 'या कालावधीत कोणताही गंभीर पुराचा धोका नाही.',
    },
    slider: {
      title: '0–3 तास पूर अंदाज टाइमलाइन',
      subTitle: 'पुराचा अंदाज पाहण्यासाठी स्लाइडर हलवा',
      play: 'सुरू करा',
      pause: 'थांबवा',
      reset: 'सध्याची वेळ',
      nowLive: 'आत्ता (लाइव्ह)',
      plusMin: 'मि',
      plusHour: 'तास',
      rainRateLabel: 'पावसाचा वेग:',
      forecastDepthLabel: 'कमाल खोली:',
    },
    reportModal: {
      title: 'पाण्याच्या खोलीची नोंद करा',
      subTitle: 'महापालिकेला रिअल-टाइम माहिती देण्यास मदत करा',
      locationLabel: 'ठिकाण / खूण',
      depthLabel: 'पाण्याची खोली (सेमी)',
      photoLabel: 'फोटो अपलोड करा (पर्यायी)',
      photoNote: 'पाणी साचल्याचा फोटो निवडा',
      obsLabel: 'अधिक माहिती',
      obsPlaceholder: 'अडकलेली वाहने, तुंबलेली गटारे याबद्दल सांगा...',
      helpCheck: 'तातडीच्या मदतीची गरज आहे',
      submitBtn: 'माहिती पाठवा',
      submitting: 'पाठवत आहे...',
      cancelBtn: 'रद्द करा',
      successToast: 'माहिती यशस्वीरीत्या महापालिका नियंत्रण कक्षाकडे पाठवली!',
    },
    authModal: {
      title: 'आपत्ती व्यवस्थापन अधिकारी लॉगिन',
      subTitle: 'भूगर्भातील माहिती आणि पंप नियंत्रणासाठी लॉगिन करा',
      domainLabel: 'प्राधिकरण डोमेन / आयडी',
      domainPlaceholder: 'उदा. mumbai.aqua.gov.in',
      passcodeLabel: 'पासकोड',
      passcodePlaceholder: '८ अंकी पासकोड टाका',
      loginBtn: 'लॉगिन करा',
      loggingIn: 'तपासत आहे...',
      demoNote: 'डेमो पासकोड:',
      invalidCredentials: 'चुकीचा पासकोड. डेमो पासकोड 12345678 वापरा.',
    },
    dashboard: {
      title: 'आपत्ती व्यवस्थापन कमांड सेंटर',
      subTitle: 'रिअल-टाइम महापालिका पूर नियंत्रण आणि पंप व्यवस्थापन',
      officerBadge: 'सक्रिय अधिकारी:',
      totalSubmerged: 'पाण्याखालील रस्ते',
      surchargingPipes: 'ओव्हरफ्लो गटारे',
      pumpsActive: 'सुरू असलेले पंप',
      exportSitRep: 'SitRep अहवाल डाउनलोड करा',
      pumpControllerTitle: 'पंप स्टेशन नियंत्रण',
      pumpStatus: 'पंप स्थिती',
      activatePump: 'पंप सुरू करा (1500 L/s)',
      deactivatePump: 'स्टैंडबाय मोड',
      groundTruthTitle: 'नागरिक नोंदींची पडताळणी',
      verifyBtn: 'सत्यापित करा',
      dismissBtn: 'रद्द करा',
      statusPending: 'प्रलंबित',
      statusVerified: 'सत्यापित केले',
      statusDismissed: 'रद्द केले',
      evacRouteBtn: 'स्थलांतर योजना तयार करा',
    },
    sitrep: {
      title: 'परिस्थिती अहवाल (SitRep) निर्यातक',
      subTitle: 'वरिष्ठ अधिकाऱ्यांसाठी अधिकृत पूर अहवाल तयार करा',
      generatePdf: 'SitRep PDF डाउनलोड करा',
      downloadCsv: 'CSV डेटा निर्यात करा',
      downloadJson: 'JSON डेटा निर्यात करा',
      generating: 'अहवाल तयार होत आहे...',
      summaryHeading: 'पूर परिस्थितीचा सारांश',
      criticalZones: 'मुख्य धोकादायक क्षेत्रे:',
    },
    tide: {
      title: 'उधाणाची भरती व जलसाठा',
      highTideCountdown: 'पुढील भरती वेळ:',
      nextHighTide: 'भरतीची उंची:',
      seaLevel: 'समुद्र पातळी:',
      reservoirStorage: 'प्रमुख जलसाठा:',
      lakesRunway: 'पाणी पुरवठा दिवस:',
    },
    drainage: {
      title: 'भूगर्भातील गटार नेटवर्क',
      undergroundGraph: '१D भूगर्भातील नाले',
      coupledSurface: 'पृष्ठभागावरील पाणी',
      pipeDischarge: 'कमाल प्रवाह दर',
      capacityUsage: 'क्षमता वापर',
      criticalNodes: 'ओव्हरफ्लो मॅनहोल्स',
    },
    map: {
      layers: 'नकाशा स्तर',
      basemapVector: 'रस्ता नकाशा',
      basemapSat: 'सॅटेलाइट नकाशा',
      inundationMesh: 'पाण्याची खोली',
      pipeGraph: 'गटार नेटवर्क',
      citizenReports: 'नागरिक नोंदी',
      legendTitle: 'पाण्याच्या खोलीचे रंग',
      depthSafe: '< 10 सेमी (सुरक्षित)',
      depthModerate: '10 – 25 सेमी (काळजी घ्या)',
      depthHigh: '25 – 45 सेमी (धोकादायक)',
      depthSevere: '> 45 सेमी (अगम्य)',
      surchargingNode: 'मॅनहोल ओव्हरफ्लो',
      safeRoute: 'सुरक्षित पर्याय मार्ग',
      popupRoad: 'रस्ता:',
      popupDepth: 'अंदाजित खोली:',
      popupStatus: 'स्थिती:',
      popupPassable: 'वाहनांसाठी योग्य',
      popupImpassable: 'पाणी साचले आहे - टाळा',
    },
    evacuationModal: {
      title: 'आपत्कालीन स्थलांतर व मार्गदर्शन योजना',
      subTitle: 'तुमच्या वाहनाच्या क्षमतेनुसार टप्पा-दर-टप्पा सुरक्षित मार्ग मार्गदर्शन',
      selectVehicle: 'तुमचा वाहन प्रकार निवडा:',
      hazardZone: 'सक्रिय पूर धोका क्षेत्र',
      shelterHeading: 'जवळचे सुरक्षित आपत्कालीन निवारा केंद्र',
      elevationGain: 'उंची वाढ',
      stepByStepHeading: 'टप्पा-दर-टप्पा स्थलांतर मार्ग योजना',
      step1Title: 'टप्पा १: तातडीची तयारी व पाणी पातळी तपासणी',
      step2Title: 'टप्पा २: पाण्याखालील रस्ते व सबवे टाळा',
      step3Title: 'टप्पा ३: वळण-दर-वळण सुरक्षित मार्ग निर्देश',
      step4Title: 'टप्पा ४: निवारा केंद्रात आगमन व मदत नोंदणी',
      deployMapBtn: 'नकाशावर सुरक्षित स्थलांतर मार्ग दाखवा',
      closeBtn: 'योजना बंद करा',
    },
  },

  ta: {
    nav: {
      brand: 'AquaAlert',
      subTitle: 'நகர்ப்புற வெள்ள முன்னறிவிப்பு போர்ட்டல்',
      backToLanding: 'முகப்புப் பக்கத்திற்குச் செல்',
      openMeteoApi: 'Open-Meteo API',
      liveWeather: 'நேரலை வானிலை',
      maxDepth: 'அதிகபட்ச ஆழம்',
      reportWater: 'வெள்ளத்தைப் புகாரளிக்கவும்',
      authorityCenter: 'அதிகாரப்பூர்வ கட்டுப்பாட்டு மையம்',
      authorityPortal: 'அதிகாரப்பூர்வ போர்டல்',
      selectCity: 'நகரத்தைத் தேர்ந்தெடுக்கவும்',
      selectEvent: 'மழை சூழ்நிலையைத் தேர்ந்தெடுக்கவும்',
      lakes7: '7 ஏரிகள்: 87%',
      reservoirs5: '5 நீர்த்தேக்கங்கள்: 82%',
      yamunaStage: 'யமுனை மட்டம்: 204.8m',
    },
    landing: {
      leadTimeBadge: '0–3 மணிநேர முன் கணிப்பு காலம்',
      heroTitle: 'தரைமட்ட மற்றும் நிலத்தடி ஒருங்கிணைந்த வெள்ள நுண்ணறிவு',
      heroSubtitle: 'தெரு அளவிலான நீரின் ஆழம், பாதாள சாக்கடை வழிதல் மற்றும் வெள்ளமில்லா பாதுகாப்பான வழிகளை உடனுக்குடன் கணிக்கவும்.',
      metricLeadTime: '0–3 மணி',
      metricHydraulics: '1D + 2D',
      metricPrecision: 'தெரு-அளவு',
      metricDetours: '100%',
      metricLeadTimeSub: 'முன்னறிவிப்பு காலம்',
      metricHydraulicsSub: 'ஒருங்கிணைந்த ஹைட்ராலிக்ஸ்',
      metricPrecisionSub: 'ஆழத் துல்லியம் (செ.மீ)',
      metricDetoursSub: 'பாதுகாப்பான மாற்று வழிகள்',
      selectCityTitle: 'நகர கட்டுப்பாட்டு மையத்தைத் தேர்ந்தெடுக்கவும்',
      selectCitySub: 'GIS வெள்ள டாஷ்போர்டைத் திறக்க கீழே உள்ள நகரத்தைத் தேர்ந்தெடுக்கவும்',
      liveRadar: 'நேரலை ரேடார்',
      highRiskHotspots: 'அதிக ஆபத்துள்ள பகுதிகள்:',
      authorityLoginDomain: 'அதிகாரப்பூர்வ உள்நுழைவு:',
      launchDashboard: 'டாஷ்போர்டைத் திற',
      authorityLoginBtn: 'அதிகாரி உள்நுழைவு',
      simTitle: 'மழைநீர்வழிந்தோடல் சிமுலேட்டர் முன்னோட்டம்',
      simSub: 'தெரு வெள்ளத்தை கணிக்க மழையின் அளவை மாற்றவும்',
      simRainRate: 'மழை அளவு:',
      moderate: 'மிதமான (15 மிமீ/மணி)',
      heavy: 'கனமழை (45 மிமீ/மணி)',
      cloudburst: 'மேகவெடிப்பு (85 மிமீ/மணி)',
      predictedDepth: 'கணிக்கப்பட்ட நீரின் ஆழம்:',
      underpassLocation: 'தாழ்வான சுரங்கப்பாதையில்',
      capacityExceeded: '⚠️ வடிகால் கொள்ளளவு தாண்டப்பட்டது (>100%). தெருவில் நீர் வழிதல்.',
      capacityAdequate: '✅ வடிகால் கொள்ளளவு போதுமானது.',
      faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
      faqBadge: 'முக்கிய வினாக்கள்',
      faqMainHeading: 'AquaAlert பற்றி நீங்கள் தெரிந்து கொள்ள வேண்டியவை',
      footerTitle: 'AquaAlert • நகர்ப்புற வெள்ள முன்னறிவிப்பு அமைப்பு',
      footerSub: 'புவி அறிவியல் அமைச்சகம் (MoES) • தேசிய நடுத்தர வரம்பு வானிலை முன்னறிவிப்பு மையம் (NCMRWF)',
      feature1Title: 'ஒருங்கிணைந்த 1D + 2D ஹைட்ராலிக்ஸ்',
      feature1Sub: 'ரேடார் தரவு, 2D தரைமட்ட நீர் மற்றும் 1D நிலத்தடி வடிகால் வலையமைப்பை இணைக்கிறது.',
      feature2Title: 'பாதுகாப்பான வழித்தட API',
      feature2Sub: 'வெள்ளத்தில் மூழ்கிய பாதைகளைத் தவிர்த்து வாகனங்களைப் பாதுகாப்பான மாற்று வழிகளில் திருப்புகிறது.',
      feature3Title: 'அதிகாரப்பூர்வ SitRep ஏற்றுமதி',
      feature3Sub: 'பேரிடர் மேலாண்மைக் குழுக்களுக்கு மோட்டார் கட்டுப்பாடுகள் மற்றும் அறிக்கை பதிவிறக்க வசதி வழங்குகிறது.',
    },
    faqs: [
      {
        q: 'அதிகாரிகள் உள்நுழைய என்ன சான்றுகளைப் பயன்படுத்துகிறார்கள்?',
        a: 'அதிகாரிகள் தங்கள் அதிகாரப்பூர்வ நகர டொமைன் (எ.கா. chennai.aqua.gov.in) மற்றும் கடவுச்சொல்: 12345678 பயன்படுத்தி உள்நுழைகிறார்கள்.'
      },
      {
        q: 'AquaAlert 0–3 மணி நேரத்திற்கு முன்பே வெள்ளத்தை எவ்வாறு கணிக்கிறது?',
        a: 'AquaAlert நேரலை ரேடார் தரவு, 2D நிலப்பரப்பு மாதிரி மற்றும் 1D நிலத்தடி வடிகால் வலையமைப்பை இணைத்து துல்லியமாக கணிக்கிறது.'
      },
      {
        q: 'எந்த இந்திய நகரங்கள் தற்சமயம் சேர்க்கப்பட்டுள்ளன?',
        a: 'மும்பை, டெல்லி மற்றும் சென்னை (வேளச்சேரி, தி. நகர், சைதாப்பேட்டை).'
      },
      {
        q: 'பாதுகாப்பான வழித்தட அமைப்பு எவ்வாறு செயல்படுகிறது?',
        a: 'நீரின் ஆழத்திற்கு ஏற்ப வாகனங்களை பாதுகாப்பான மாற்று வழிகளில் திசைமாற்றுகிறது.'
      },
      {
        q: 'பொதுமக்கள் எவ்வாறு தகவல்களைப் பகிரலாம்?',
        a: '"வெள்ளத்தைப் புகாரளிக்கவும்" பொத்தானைக் கிளிக் செய்து தகவல்களை அனுப்பலாம்.'
      }
    ],
    routing: {
      title: 'வெள்ளமில்லா அவசர வழித் திட்டமிடுபவர்',
      subTitle: 'நேரலை வெள்ள முன்னறிவிப்பின் அடிப்படையில் பாதுகாப்பான வழியைக் கணக்கிடுகிறது',
      originPlaceholder: 'தொடக்க இடம் / தற்போதைய GPS',
      destPlaceholder: 'செல்ல வேண்டிய இடம் / மருத்துவமனை / முகாம்',
      pickOrigin: 'வரைபடத்தில் தேர்வு செய்க',
      pickDest: 'செல்லுமிடத்தைத் தேர்வு செய்க',
      pinned: 'வரைபடத்தில் குறிக்கப்பட்டது',
      carSedan: 'கார் / செடான்',
      ambulance: 'ஆம்புலன்ஸ் (அவசரம்)',
      autoBike: 'ஆட்டோ / பைக்',
      pedestrian: 'நடைபயணம் (நடந்து)',
      findRoute: 'பாதுகாப்பான வழியைக் கண்டுபிடி',
      calculating: 'வழியைக் கணக்கிடுகிறது...',
      distance: 'தூரம்',
      eta: 'எதிர்பார்க்கப்படும் நேரம்',
      riskScore: 'வழித்தட ஆபத்து',
      riskSafe: 'பாதுகாப்பான வழி (0-10 செ.மீ)',
      riskModerate: 'மிதமான வெள்ளம் (10-25 செ.மீ)',
      riskHigh: 'அதிக ஆபத்து (25-45 செ.மீ)',
      riskImpassable: 'செல்ல முடியாதது (>45 செ.மீ)',
      turnByTurn: 'பாதுகாப்பான வழி வழிகாட்டல்',
      noRouteFound: 'பாதுகாப்பான வழி எதுவும் கிடைக்கவில்லை. வேறு இடத்தைத் தேர்ந்தெடுக்கவும்.',
      pickLocationPrompt: 'இடத்தைத் தேர்ந்தெடுக்க வரைபடத்தில் கிளிக் செய்யவும்',
      clearRoute: 'வழியை நீக்கு',
      vehicleProfileClearance: 'வாகன சுயவிவரம் மற்றும் அனுமதி வரம்பு:',
      maxSafe: 'அதிகபட்ச பாதுகாப்பானது:',
      hatchback: 'ஹேட்ச்பேக்',
      suv: 'எஸ்.யு.வி 4x4',
      bus: 'பேருந்து / கனரக வாகனம்',
      realRoadSafeRoute: 'AquaAlert நிஜ சாலை வெள்ளமில்லா பாதுகாப்பான வழி',
      noSafeRouteFor: 'பாதுகாப்பான வழி இல்லை:',
      selectHazardZone: 'வெள்ள அபாயப் பகுதியைத் தேர்ந்தெடுக்கவும்:',
      nearestShelter: 'அருகிலுள்ள பாதுகாப்பான நிவாரண முகாம்',
      rescueVehicleRoute: 'மீட்பு வாகன வழி',
    },
    alerts: {
      title: 'நேரலை ஆபத்து எச்சரிக்கைகள்',
      subTitle: 'வெள்ளம் மற்றும் வடிகால் வழிதல் பற்றிய உடனடி அறிவிப்புகள்',
      tabAll: 'எல்லா எச்சரிக்கைகளும்',
      tabInundation: 'தெரு வெள்ளம்',
      tabSurcharge: 'சாக்கடை வழிதல்',
      tabReports: 'பொதுமக்கள் புகார்கள்',
      critical: 'மிகவும் ஆபத்தானது',
      warning: 'எச்சரிக்கை',
      advisory: 'ஆலோசனை',
      helplineTitle: 'அவசரகால உதவி எண்கள்',
      ndrfHelpline: 'NDRF கட்டுப்பாட்டு அறை',
      controlRoom: 'மாநகராட்சி கட்டுப்பாட்டு அறை',
      disasterLine: 'பேரிடர் உதவி எண்',
      reportedAgo: 'நிமிடங்களுக்கு முன்',
      verified: 'சரிபார்க்கப்பட்டது',
      unverified: 'சரிபார்க்கப்படாதது',
      borough: 'பகுதி / மண்டலம்',
      elevation: 'உயரம்',
      overcapacity: 'கொள்ளளவை விட அதிகம்',
      surfaceSpill: 'தரைமட்ட நீர் வழிதல்',
      hydraulicBackflow: 'வடிகால் பின்னோக்கிய நீர் பாய்வு',
      noAlerts: 'இந்த நேரத்தில் கடுமையான வெள்ளப் பெருக்கு கணிப்பு இல்லை.',
    },
    slider: {
      title: '0–3 மணிநேர வெள்ள முன்னறிவிப்பு காலக்கோடு',
      subTitle: 'வெள்ளத்தை முன்கூட்டியே பார்க்க காலக்கோட்டை நகர்த்தவும்',
      play: 'இயக்கு',
      pause: 'நிறுத்து',
      reset: 'தற்போதைய நேரம்',
      nowLive: 'இப்போது (நேரலை)',
      plusMin: 'நிமி',
      plusHour: 'மணி',
      rainRateLabel: 'மழை வேகம்:',
      forecastDepthLabel: 'அதிகபட்ச ஆழம்:',
    },
    reportModal: {
      title: 'நீர் ஆழத்தைப் புகாரளிக்கவும்',
      subTitle: 'கட்டுப்பாட்டு மையத்திற்கு உண்மைத் தகவலை வழங்கி உதவுங்கள்',
      locationLabel: 'இடம் / அடையாளம்',
      depthLabel: 'நீரின் ஆழம் (செ.மீ)',
      photoLabel: 'புகைப்படம் பதிவேற்றவும் (விருப்பத்தேர்வு)',
      photoNote: 'வெள்ள புகைப்படத்தை பதிவேற்றவும்',
      obsLabel: 'கூடுதல் விவரங்கள்',
      obsPlaceholder: 'சிக்கிய வாகனங்கள், அடைபட்ட வடிகால்கள் பற்றி குறிப்பிடவும்...',
      helpCheck: 'உடனடி அவசர உதவி தேவை',
      submitBtn: 'புகாரைச் சமர்ப்பிக்கவும்',
      submitting: 'சமர்ப்பிக்கிறது...',
      cancelBtn: 'ரத்து செய்',
      successToast: 'புகார் கட்டுப்பாட்டு மையத்திற்கு வெற்றிகரமாக அனுப்பப்பட்டது!',
    },
    authModal: {
      title: 'பேரிடர் மேலாண்மை அதிகாரி உள்நுழைவு',
      subTitle: 'நிலத்தடி வடிகால் தரவு மற்றும் பம்ப் கட்டுப்பாடுகளை அணுகவும்',
      domainLabel: 'அதிகாரப்பூர்வ டொமைன் / ID',
      domainPlaceholder: 'எ.கா. chennai.aqua.gov.in',
      passcodeLabel: 'கடவுச்சொல்',
      passcodePlaceholder: '8 இலக்க கடவுச்சொல்லை உள்ளிடவும்',
      loginBtn: 'உள்நுழைக',
      loggingIn: 'சரிபார்க்கிறது...',
      demoNote: 'மாதிரி கடவுச்சொல்:',
      invalidCredentials: 'தவறான கடவுச்சொல். 12345678 என்ற கடவுச்சொல்லைப் பயன்படுத்தவும்.',
    },
    dashboard: {
      title: 'பேரிடர் மேலாண்மை கட்டுப்பாட்டு மையம்',
      subTitle: 'நேரலை நகராட்சி வெள்ளத் தரவு மற்றும் பம்ப் மேலாண்மை',
      officerBadge: 'செயலில் உள்ள அதிகாரி:',
      totalSubmerged: 'மூழ்கிய சாலைகள்',
      surchargingPipes: 'வழியும் சாக்கடைகள்',
      pumpsActive: 'இயங்கும் மோட்டார்கள்',
      exportSitRep: 'SitRep அறிக்கையைப் பதிவிறக்கு',
      pumpControllerTitle: 'நீரேற்று நிலைய செயல்பாடுகள்',
      pumpStatus: 'மோட்டார் நிலை',
      activatePump: 'மோட்டாரை இயக்கு (1500 L/s)',
      deactivatePump: 'காத்திருப்பு நிலை',
      groundTruthTitle: 'பொதுமக்கள் புகார்கள் சரிபார்ப்பு',
      verifyBtn: 'சரிபார் & நடவடிக்கை எடு',
      dismissBtn: 'நிராகரி',
      statusPending: 'நிலுவையில் உள்ளது',
      statusVerified: 'சரிபார்க்கப்பட்டது',
      statusDismissed: 'நிராகரிக்கப்பட்டது',
      evacRouteBtn: 'வெளியேற்ற திட்டத்தை உருவாக்கு',
    },
    sitrep: {
      title: 'சூழ்நிலை அறிக்கை (SitRep) ஏற்றுமதியாளர்',
      subTitle: 'உயரதிகாரிகளுக்கான அதிகாரப்பூர்வ வெள்ள நிலை அறிக்கை',
      generatePdf: 'SitRep PDF பதிவிறக்கு',
      downloadCsv: 'CSV தரவை ஏற்றுமதி செய்',
      downloadJson: 'JSON தரவை ஏற்றுமதி செய்',
      generating: 'அறிக்கை தயாராகிறது...',
      summaryHeading: 'வெள்ள நிலைமை சுருக்கம்',
      criticalZones: 'முக்கிய ஆபத்தான பகுதிகள்:',
    },
    tide: {
      title: 'அலை மற்றும் நீர்நிலை தரவு',
      highTideCountdown: 'அடுத்த கடல் அலை நேரம்:',
      nextHighTide: 'அலையின் உயரம்:',
      seaLevel: 'கடல் நீர் மட்டம்:',
      reservoirStorage: 'நீர்த்தேக்க அளவு:',
      lakesRunway: 'குடிநீர் விநியோக நாட்கள்:',
    },
    drainage: {
      title: 'நிலத்தடி வடிகால் வலையமைப்பு',
      undergroundGraph: '1D நிலத்தடி வடிகால்',
      coupledSurface: 'தரைமட்ட நீர்',
      pipeDischarge: 'அதிகபட்ச வெளியேற்ற வேகம்',
      capacityUsage: 'கொள்ளளவு பயன்பாடு',
      criticalNodes: 'வழியும் சாக்கடைகள்',
    },
    map: {
      layers: 'வரைபட அடுக்குகள்',
      basemapVector: 'சாலை வரைபடம்',
      basemapSat: 'செயற்கைக்கோள் வரைபடம்',
      inundationMesh: 'நீரின் ஆழம்',
      pipeGraph: 'வடிகால் வலையமைப்பு',
      citizenReports: 'பொதுமக்கள் புகார்கள்',
      legendTitle: 'நீர் ஆழக் குறியீடு',
      depthSafe: '< 10 செ.மீ (பாதுகாப்பானது)',
      depthModerate: '10 – 25 செ.மீ (கவனம்)',
      depthHigh: '25 – 45 செ.மீ (அதிக ஆபத்து)',
      depthSevere: '> 45 செ.மீ (செல்ல முடியாது)',
      surchargingNode: 'சாக்கடை வழிதல்',
      safeRoute: 'பாதுகாப்பான மாற்று வழி',
      popupRoad: 'சாலை:',
      popupDepth: 'கணிக்கப்பட்ட ஆழம்:',
      popupStatus: 'நிலை:',
      popupPassable: 'வாகனங்கள் செல்லலாம்',
      popupImpassable: 'வெள்ளம் - தவிர்க்கவும்',
    },
    evacuationModal: {
      title: 'அவசரகால வெளியேற்ற வழிகாட்டுதல் திட்டம்',
      subTitle: 'உங்கள் வாகனத்தின் திறன் அடிப்படையில் படி-படியாக பாதுகாப்பான வழி',
      selectVehicle: 'உங்கள் வாகன வகையைத் தேர்ந்தெடுக்கவும்:',
      hazardZone: 'செயலில் உள்ள வெள்ள அபாயப் பகுதி',
      shelterHeading: 'அருகிலுள்ள பாதுகாப்பான நிவாரண முகாம்',
      elevationGain: 'உயர அதிகரிப்பு',
      stepByStepHeading: 'படி-படியான வெளியேற்றப் பாதை திட்டம்',
      step1Title: 'படி 1: உடனடி தயாரிப்பு & நீர் மட்டப் பரிசோதனை',
      step2Title: 'படி 2: மூழ்கிய பாதைகளைத் தவிர்க்கும் அறிவுறுத்தல்',
      step3Title: 'படி 3: திருப்பத்திற்குத் திருப்பமான பாதுகாப்பான வழி',
      step4Title: 'படி 4: நிவாரண முகாம் வருகை & உதவிப் பதிவு',
      deployMapBtn: 'வரைபடத்தில் பாதுகாப்பான வழியைக் காட்டு',
      closeBtn: 'திட்டத்தை மூடு',
    },
  },

  te: {
    nav: {
      brand: 'AquaAlert',
      subTitle: 'పట్టణ విపత్తు పూర్వానుమాన పోర్టల్',
      backToLanding: 'ముఖ్య పుటకి వెళ్లండి',
      openMeteoApi: 'Open-Meteo API',
      liveWeather: 'లైవ్ వాతావరణం',
      maxDepth: 'గరిష్ట లోతు',
      reportWater: 'నీటి ముంపును నివేదించండి',
      authorityCenter: 'అధికారిక కంట్రోల్ సెంటర్',
      authorityPortal: 'అధికారిక పోర్టల్',
      selectCity: 'నగరాన్ని ఎంచుకోండి',
      selectEvent: 'వర్ష స్థితిని ఎంచుకోండి',
      lakes7: '7 సరస్సులు: 87%',
      reservoirs5: '5 జలాశయాలు: 82%',
      yamunaStage: 'యమునా మట్టం: 204.8m',
    },
    landing: {
      leadTimeBadge: '0–3 గంటల ముందస్తు అంచనా సమయం',
      heroTitle: 'భూగర్భ మరియు ఉపరితల సమగ్ర వరద నిఘా వ్యవస్థ',
      heroSubtitle: 'వీధుల్లో నీటి లోతు, మ్యాన్‌హోల్ పొంగు మరియు వరద రహిత సురక్షిత మార్గాలను ప్రత్యక్షంగా అంచనా వేయండి.',
      metricLeadTime: '0–3 గంటలు',
      metricHydraulics: '1D + 2D',
      metricPrecision: 'వీధి-స్థాయి',
      metricDetours: '100%',
      metricLeadTimeSub: 'ముందస్తు సమయం',
      metricHydraulicsSub: 'సమగ్ర హైడ్రాలిక్స్',
      metricPrecisionSub: 'లోతు ఖచ్చితత్వం (సెం.మీ)',
      metricDetoursSub: 'సురక్షిత ప్రత్యామ్నాయ మార్గాలు',
      selectCityTitle: 'మెట్రో సిటీ కంట్రోల్ సెంటర్‌ను ఎంచుకోండి',
      selectCitySub: 'లైవ్ GIS వరద డాష్‌బోర్డ్ తెరవడానికి క్రింద నగరాన్ని ఎంచుకోండి',
      liveRadar: 'లైవ్ రాడార్',
      highRiskHotspots: 'అధిక ప్రమాద రహిత ప్రాంతాలు:',
      authorityLoginDomain: 'అధికారిక లాగిన్:',
      launchDashboard: 'డాష్‌బోర్డ్ ప్రారంభించు',
      authorityLoginBtn: 'అధికారుల లాగిన్',
      simTitle: 'ఇంటరాక్టివ్ వర్షపు నీటి రన్-ఆఫ్ సిమ్యులేటర్',
      simSub: 'నీటి ముంపును పరీక్షించడానికి వర్షపాత తీవ్రతను సర్దుబాటు చేయండి',
      simRainRate: 'సిమ్యులేటెడ్ వర్షపాతం:',
      moderate: 'సాధారణ (15 మిమీ/గం)',
      heavy: 'భారీ వర్షం (45 మిమీ/గం)',
      cloudburst: 'మేఘ విస్ఫోటనం (85 మిమీ/గం)',
      predictedDepth: 'అంచనా వేసిన నీటి లోతు:',
      underpassLocation: 'దిగువ అండర్‌పాస్ వద్ద',
      capacityExceeded: '⚠️ డ్రైనేజీ సామర్థ్యం మించిపోయింది (>100%). వీధి పైకి నీరు.',
      capacityAdequate: '✅ డ్రైనేజీ సామర్థ్యం సరిపోతుంది.',
      faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
      faqBadge: 'ముఖ్యమైన ప్రశ్నలు',
      faqMainHeading: 'AquaAlert గురించి మీరు తెలుసుకోవాల్సిన విషయాలు',
      footerTitle: 'AquaAlert • పట్టణ విపత్తు హైడ్రో-డైనమిక్ అంచనా వ్యవస్థ',
      footerSub: 'భూ విజ్ఞాన మంత్రిత్వ శాఖ (MoES) • జాతీయ మధ్యస్థ వాతావరణ సూచన కేంద్రం (NCMRWF)',
      feature1Title: 'సమగ్ర 1D + 2D హైడ్రాలిక్స్',
      feature1Sub: 'రాడార్ వర్షపాతం, 2D ఉపరితల నీరు మరియు 1D భూగర్భ కాలువల నెట్‌వర్క్‌ను అనుసంధానిస్తుంది.',
      feature2Title: 'వరద రహిత నావిగేషన్ API',
      feature2Sub: 'నీటమునిగిన రోడ్ల నుండి వాహనాలను సురక్షిత ప్రత్యామ్నాయ మార్గాల్లోకి మళ్లిస్తుంది.',
      feature3Title: 'అధికారిక SitRep నివేదిక ఎగుమతి',
      feature3Sub: 'విపత్తు నిర్వహణ బృందాలకు పంప్ నియంత్రణలు మరియు అధికారిక నివేదిక డౌన్‌లోడ్‌ను అందిస్తుంది.',
    },
    faqs: [
      {
        q: 'మున్సిపల్ అధికారులు లాగిన్ కావడానికి ఏ వివరాలు ఉపయోగిస్తారు?',
        a: 'అధికారులు తమ అధికారిక సిటీ డొమైన్ (ఉదా: mumbai.aqua.gov.in, delhi.aqua.gov.in, chennai.aqua.gov.in) మరియు పాస్‌కోడ్: 12345678 ఉపయోగించి లాగిన్ అవుతారు.'
      },
      {
        q: 'AquaAlert 0–3 గంటల ముందే వరదలను ఎలా అంచనా వేస్తుంది?',
        a: 'AquaAlert లైవ్ డాప్లర్ రాడార్ వర్షపాతం, 2D డిజిటల్ ఎలివేషన్ మోడల్ (DEM) మరియు 1D భూగర్భ డ్రైనేజీ నెట్‌వర్క్‌ను అనుసంధానించి ఖచ్చితంగా అంచనా వేస్తుంది.'
      },
      {
        q: 'ప్రస్తుతం ఏ భారతీయ నగరాలు అందుబాటులో ఉన్నాయి?',
        a: 'ముంబై, ఢిల్లీ NCR మరియు చెన్నై.'
      },
      {
        q: 'వరద రహిత సురక్షిత నావిగేషన్ ఎలా పనిచేస్తుంది?',
        a: 'నీటి లోతు ఆధారంగా వాహనాలను సురక్షిత ప్రత్యామ్నాయ మార్గాల్లోకి మళ్లిస్తుంది.'
      },
      {
        q: 'పౌరులు నిజసమయ వివరాలను ఎలా సమర్పించవచ్చు?',
        a: '"నీటి ముంపు నివేదించండి" బటన్‌పై క్లిక్ చేసి సమాచారం మరియు ఫోటోలను పంపవచ్చు.'
      }
    ],
    routing: {
      title: 'వరద రహిత అత్యవసర మార్గ నిర్దేశకం',
      subTitle: 'లైవ్ వరద అంచనాల ఆధారంగా సురక్షితమైన ప్రయాణ మార్గాన్ని లెక్కిస్తుంది',
      originPlaceholder: 'ప్రారంభ స్థానం / ప్రస్తుత GPS',
      destPlaceholder: 'గమ్యస్థానం / ఆసుపత్రి / ఆశ్రమం',
      pickOrigin: 'మ్యాప్‌పై ఎంచుకోండి',
      pickDest: 'గమ్యాన్ని ఎంచుకోండి',
      pinned: 'మ్యాప్‌పై గుర్తించబడింది',
      carSedan: 'కార్ / సెడాన్',
      ambulance: 'అంబులెన్స్ (అత్యవసరం)',
      autoBike: 'ఆటో / బైక్',
      pedestrian: 'నడక ద్వారా',
      findRoute: 'సురక్షిత మార్గాన్ని కనుగొను',
      calculating: 'మార్గం లెక్కిస్తోంది...',
      distance: 'దూరం',
      eta: 'అంచనా సమయం',
      riskScore: 'మార్గ ప్రమాదం',
      riskSafe: 'సురక్షిత మార్గం (0-10 సెం.మీ)',
      riskModerate: 'మధ్యస్థ ముంపు (10-25 సెం.మీ)',
      riskHigh: 'అధిక ప్రమాదం (25-45 సెం.మీ)',
      riskImpassable: 'వెళ్లలేని మార్గం (>45 సెం.మీ)',
      turnByTurn: 'సురక్షిత మలుపుల నావిగేషన్',
      noRouteFound: 'సురక్షిత మార్గం లభించలేదు. ప్రత్యామ్నాయ పాయింట్లను ఎంచుకోండి.',
      pickLocationPrompt: 'స్థానాన్ని ఎంచుకోవడానికి మ్యాప్‌పై క్లిక్ చేయండి',
      clearRoute: 'మార్గాన్ని తొలగించు',
      vehicleProfileClearance: 'వాహనం ప్రొఫైల్ మరియు క్లియరెన్స్ పరిమితి:',
      maxSafe: 'గరిష్ట సురక్షితం:',
      hatchback: 'హ్యాచ్‌బ్యాక్',
      suv: 'ఎస్.యు.వి 4x4',
      bus: 'బస్సు / బరువైన వాహనం',
      realRoadSafeRoute: 'AquaAlert నిజమైన రోడ్డు వరద సురక్షిత మార్గం',
      noSafeRouteFor: 'దీనికి సురక్షిత మార్గం లేదు:',
      selectHazardZone: 'వరద ప్రమాద ప్రాంతాన్ని ఎంచుకోండి:',
      nearestShelter: 'సమీప సురక్షిత పునరావాస కేంద్రం',
      rescueVehicleRoute: 'రక్షణ వాహన మార్గం',
    },
    alerts: {
      title: 'లైవ్ విపత్తు హెచ్చరికలు',
      subTitle: 'ప్రత్యక్ష నీటి ముంపు మరియు డ్రైనేజీ పొంగు నివేదికలు',
      tabAll: 'అన్ని హెచ్చరికలు',
      tabInundation: 'వీధి ముంపు',
      tabSurcharge: 'డ్రైనేజీ పొంగు',
      tabReports: 'పౌరుల నివేదికలు',
      critical: 'తీవ్రమైనది',
      warning: 'హెచ్చరిక',
      advisory: 'సూచన',
      helplineTitle: 'అత్యవసర సహాయ సంఖ్యలు',
      ndrfHelpline: 'NDRF కంట్రోల్ రూమ్',
      controlRoom: 'మున్సిపల్ కంట్రోల్ రూమ్',
      disasterLine: 'విపత్తు సహాయ సంఖ్య',
      reportedAgo: 'నిమిషాల క్రితం',
      verified: 'ధృవీకరించబడింది',
      unverified: 'ధృవీకరించబడలేదు',
      borough: 'మండలం / ప్రాంతం',
      elevation: 'ఎత్తు',
      overcapacity: 'సామర్థ్యానికి మించి',
      surfaceSpill: 'ఉపరితల నీటి పొంగు',
      hydraulicBackflow: 'డ్రైనేజీ బ్యాక్‌ఫ్లో',
      noAlerts: 'ఈ సమయానికి ఎటువంటి తీవ్రమైన వరద ముప్పు లేదు.',
    },
    slider: {
      title: '0–3 గంటల వరద ముందస్తు అంచనా స్లైడర్',
      subTitle: 'వరద పరిస్థితిని ముందుగానే చూడటానికి స్లైడర్‌ను జరపండి',
      play: 'ప్లే చేయండి',
      pause: 'ఆపండి',
      reset: 'ప్రస్తుత సమయం',
      nowLive: 'ఇప్పుడు (లైవ్)',
      plusMin: 'నిమి',
      plusHour: 'గం',
      rainRateLabel: 'వర్షపాత తీవ్రత:',
      forecastDepthLabel: 'గరిష్ట లోతు:',
    },
    reportModal: {
      title: 'నీటి ముంపును నివేదించండి',
      subTitle: 'కంట్రోల్ రూమ్‌కు నిజసమయ వివరాలు అందించి సహాయపడండి',
      locationLabel: 'ప్రాంతం / మైలురాయి',
      depthLabel: 'నీటి లోతు (సెం.మీ)',
      photoLabel: 'ఫోటో అప్‌లోడ్ చేయండి (ఐచ్ఛికం)',
      photoNote: 'ముంపు ఫోటోను ఎంచుకోండి',
      obsLabel: 'అదనపు వివరాలు',
      obsPlaceholder: 'నిలిచిపోయిన వాహనాలు, మూసుకుపోయిన కాలువల గురించి తెలపండి...',
      helpCheck: 'వెంటనే అత్యవసర సహాయం కావాలి',
      submitBtn: 'నివేదిక సమర్పించండి',
      submitting: 'సమర్పిస్తోంది...',
      cancelBtn: 'రద్దు చేయి',
      successToast: 'నివేదిక మున్సిపల్ కంట్రోల్ రూమ్‌కు విజయవంతంగా పంపబడింది!',
    },
    authModal: {
      title: 'విపత్తు నిర్వహణ అధికారుల లాగిన్',
      subTitle: 'భూగర్భ డేటా మరియు పంప్ నియంత్రణలను పొందండి',
      domainLabel: 'అధికారిక డొమైన్ / ID',
      domainPlaceholder: 'ఉదా: mumbai.aqua.gov.in',
      passcodeLabel: 'పాస్‌కోడ్',
      passcodePlaceholder: '8 అంకెల పాస్‌కోడ్ నమోదు చేయండి',
      loginBtn: 'లాగిన్ అవ్వండి',
      loggingIn: 'తనిఖీ చేస్తోంది...',
      demoNote: 'డెమో పాస్‌కోడ్:',
      invalidCredentials: 'చెల్లని వివరాలు. డెమో పాస్‌కోడ్ 12345678 ఉపయోగించండి.',
    },
    dashboard: {
      title: 'విపత్తు నిర్వహణ కంట్రోల్ సెంటర్',
      subTitle: 'లైవ్ మున్సిపల్ వరద డేటా మరియు పంప్ నియంత్రణ',
      officerBadge: 'ప్రస్తుత అధికారి:',
      totalSubmerged: 'మునిగిపోయిన రోడ్లు',
      surchargingPipes: 'పొంగుతున్న కాలువలు',
      pumpsActive: 'పనిచేస్తున్న పంపులు',
      exportSitRep: 'SitRep నివేదిక డౌన్‌లోడ్ చేయండి',
      pumpControllerTitle: 'వాటర్ పంపింగ్ స్టేషన్ నిర్వహణ',
      pumpStatus: 'పంప్ స్థితి',
      activatePump: 'పంప్ ప్రారంభించు (1500 L/s)',
      deactivatePump: 'స్టాండ్‌బై మోడ్',
      groundTruthTitle: 'పౌరుల నివేదికల తనిఖీ',
      verifyBtn: 'ధృవీకరించు & చర్య తీసుకో',
      dismissBtn: 'తిరస్కరించు',
      statusPending: 'పరిశీలనలో ఉంది',
      statusVerified: 'ధృవీకరించబడింది',
      statusDismissed: 'తిరస్కరించబడింది',
      evacRouteBtn: 'తరలింపు ప్రణాళిక తయారుచేయి',
    },
    sitrep: {
      title: 'పరిస్థితి నివేదిక (SitRep) ఎగుమతి',
      subTitle: 'ఉన్నతాధికారుల కోసం అధికారిక వరద నివేదిక తయారు చేయండి',
      generatePdf: 'SitRep PDF డౌన్‌లోడ్',
      downloadCsv: 'CSV డేటా ఎగుమతి',
      downloadJson: 'JSON డేటా ఎగుమతి',
      generating: 'నివేదిక తయారవుతోంది...',
      summaryHeading: 'వరద పరిస్థితి సారాంశం',
      criticalZones: 'ముఖ్యమైన ప్రమాదకర ప్రాంతాలు:',
    },
    tide: {
      title: 'సముద్ర అ అలలు & జలాశయ మట్టాలు',
      highTideCountdown: 'తదుపరి అలై సమయం:',
      nextHighTide: 'అలై ఎత్తు:',
      seaLevel: 'సముద్ర మట్టం:',
      reservoirStorage: 'జలాశయ నీటి నిల్వ:',
      lakesRunway: 'నీటి సరఫరా రోజులు:',
    },
    drainage: {
      title: 'భూగర్భ డ్రైనేజీ నెట్‌వర్క్',
      undergroundGraph: '1D భూగర్భ కాలువలు',
      coupledSurface: 'ఉపరితల నీరు',
      pipeDischarge: 'గరిష్ట ప్రవాహ వేగం',
      capacityUsage: 'సామర్థ్య వినియోగం',
      criticalNodes: 'పొంగుతున్న కాలువలు',
    },
    map: {
      layers: 'మ్యాప్ లేయర్లు',
      basemapVector: 'రోడ్డు మ్యాప్',
      basemapSat: 'శాటిలైట్ మ్యాప్',
      inundationMesh: 'నీటి లోతు',
      pipeGraph: 'డ్రైనేజీ నెట్‌వర్క్',
      citizenReports: 'పౌరుల నివేదికలు',
      legendTitle: 'నీటి లోతు సూచిక',
      depthSafe: '< 10 సెం.మీ (సురక్షితం)',
      depthModerate: '10 – 25 సెం.మీ (జాగ్రత్త)',
      depthHigh: '25 – 45 సెం.మీ (అధిక ప్రమాదం)',
      depthSevere: '> 45 సెం.మీ (వెళ్లలేరు)',
      surchargingNode: 'మ్యాన్‌హోల్ పొంగు',
      safeRoute: 'సురక్షిత ప్రత్యామ్నాయ మార్గం',
      popupRoad: 'రోడ్డు:',
      popupDepth: 'అంచనా వేసిన లోతు:',
      popupStatus: 'స్థితి:',
      popupPassable: 'వాహనాలు వెళ్ళవచ్చు',
      popupImpassable: 'వరద నీరు - వెళ్లకండి',
    },
    evacuationModal: {
      title: 'అత్యవసర తరలింపు & మార్గదర్శక ప్రణాళిక',
      subTitle: 'మీ వాహన సామర్థ్యం ఆధారంగా దశలవారీ సురక్షిత మార్గ నిర్దేశం',
      selectVehicle: 'మీ వాహన రకాన్ని ఎంచుకోండి:',
      hazardZone: 'ప్రస్తుత వరద ప్రమాద ప్రాంతం',
      shelterHeading: 'సమీప సురక్షిత పునరావాస కేంద్రం',
      elevationGain: 'ఎత్తు లాభం',
      stepByStepHeading: 'దశలవారీ తరలింపు ప్రయాణ ప్రణాళిక',
      step1Title: 'దశ 1: తక్షణ సన్నాహం & నీటి పరిమితి తనిఖీ',
      step2Title: 'దశ 2: మునిగిన రోడ్లు & అండర్‌పాస్‌లను నివారించడం',
      step3Title: 'దశ 3: మలుపుల వారీగా సురక్షిత మార్గ నిర్దేశం',
      step4Title: 'దశ 4: పునరావాస కేంద్రానికి చేరుకోవడం & నమోదు',
      deployMapBtn: 'మ్యాప్‌పై సురక్షిత మార్గాన్ని చూడండి',
      closeBtn: 'ప్రణాళికను మూసివేయి',
    },
  },
};
