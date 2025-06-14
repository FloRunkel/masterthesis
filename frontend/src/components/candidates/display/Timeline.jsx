import React from 'react';
import { Box, Typography, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const getBarColors = [
  '#8AD265', // grün
  '#FFC03D', // gelb
  '#FF2525', // rot
  '#666'  // grau für Sonstiges
];

const Timeline = ({ prediction, profile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!prediction) return null;

  // Werte berechnen
  const confidenceValue = Array.isArray(prediction.confidence) ? prediction.confidence[0] : prediction.confidence;
  const tageBisWechsel = Math.round(confidenceValue);
  const heute = new Date();
  const wechselDatum = new Date(heute.getTime() + tageBisWechsel * 24 * 60 * 60 * 1000);

  // Phasen berechnen
  const tageBisBewerbung = Math.round(tageBisWechsel * 0.3);
  const tageBisIntensiveSuche = Math.round(tageBisWechsel * 0.7);
  const bewerbungsDatum = new Date(heute.getTime() + tageBisBewerbung * 24 * 60 * 60 * 1000);
  const intensiveSucheDatum = new Date(heute.getTime() + tageBisIntensiveSuche * 24 * 60 * 60 * 1000);

  // Timeline-Phasen
  const phases = [
    {
      icon: <PersonIcon sx={{ fontSize: 32, color: '#3B82F6' }} />,
      label: 'Today', 
      desc: 'Job change detected',  
      date: heute.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
      color: '#3B82F6'
    },
    {
      icon: <WorkOutlineIcon sx={{ fontSize: 32, color: '#F59E42' }} />,
      label: `In about ${tageBisBewerbung} days`,
      desc: 'First job search activities expected',
      date: bewerbungsDatum.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
      color: '#F59E42'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#F59E42' }} />,
      label: `In about ${tageBisIntensiveSuche} days`,
      desc: 'Intensive job search phase',
      date: intensiveSucheDatum.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
      color: '#F59E42'
    },
    {
      icon: <FlagIcon sx={{ fontSize: 32, color: '#F87171' }} />,
      label: wechselDatum.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
      desc: 'Expected job change',
      date: wechselDatum.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
      color: '#F87171'
    }
  ];

  // SHAP-Explanations
  let explanations = prediction.explanations || [];
  explanations = explanations.slice().sort((a, b) => b.impact_percentage - a.impact_percentage);
  const top3 = explanations.slice(0, 3);
  const sonstigeSumme = explanations.slice(3).reduce((sum, f) => sum + f.impact_percentage, 0);
  const barData = [
    ...top3.map((f, i) => ({
      ...f,
      color: getBarColors[i]
    })),
    ...(sonstigeSumme > 0 ? [{
      feature: 'Other',
      impact_percentage: sonstigeSumme,
      color: getBarColors[3]
    }] : [])
  ];

  return (
    <Box sx={{ width: '100%', my: 0, p: isMobile ? 0.5 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 2 : 4, position: 'relative', overflow: 'visible' }}>

      {/* Erklärung über der Timeline */}
      <Box sx={{ width: '100%', mb: 0 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 800, 
          color: '#13213C', 
          mb: isMobile ? 0.5 : 1, 
          fontSize: isMobile ? '1.2rem' : '1.5rem' 
        }}>
          Career Change Prediction Timeline
        </Typography>
        <Typography sx={{ 
          color: '#444', 
          fontSize: isMobile ? '0.9rem' : '1rem', 
          lineHeight: 1.7 
        }}>
          This timeline visualizes the predicted career change process for the candidate. It shows the current status, the expected start of job search activities, the phase of intensive job seeking, and the estimated date of the next job change.
        </Typography>
      </Box>
      {/* Tage bis Wechsel ganz oben */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', mb: isMobile ? 0.5 : 1, justifyContent: 'left', alignItems: 'center', gap: isMobile ? 0.5 : 1 }}>

        <Typography sx={{ 
          fontWeight: 900, 
          fontSize: isMobile ? 40 : 54, 
          color: '#F59E42', 
          mb: isMobile ? 0.2 : 0.5, 
          lineHeight: 1 
        }}>
          {tageBisWechsel}
        </Typography>
        <Typography sx={{ 
          fontWeight: 600, 
          fontSize: isMobile ? '0.9rem' : '1rem', 
          color: '#13213C' 
        }}>
          Days until job change
        </Typography>
      </Box>

      {/* Timeline */}
      <Box sx={{ width: '100%', maxWidth: 1200, mb: 2, position: 'relative', minHeight: { xs: 500, md: 180 } }}>
        {/* Horizontale Linie: Nur auf lg+ sichtbar */}
        <Box sx={{
          position: 'absolute',
          top: 36,
          left: 0,
          right: 0,
          width: '100%',
          height: 6,
          background: 'linear-gradient(90deg, #3B82F6 0%, #F59E42 50%, #F87171 100%)',
          borderRadius: 3,
          zIndex: 1,
          display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' }
        }} />
        {/* Phasen */}
        <Box sx={{
          display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'grid' },
          flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'unset' },
          gridTemplateColumns: { lg: 'repeat(auto-fit, minmax(0px, 1fr))' },
          position: 'relative',
          zIndex: 2,
          gap: { xs: 4, sm: 4, md: 4, lg: 2 },
          width: '100%',
        }}>
          {phases.map((phase, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'column' },
                alignItems: { xs: 'flex-start', sm: 'flex-start', md: 'flex-start', lg: 'center' },
                justifyContent: 'center',
                minWidth: { xs: 0, lg: 180 },
                width: { xs: '100%', lg: '100%' },
                mb: { xs: 2, sm: 2, md: 2, lg: 0 },
                gap: { xs: 2, sm: 2, md: 2, lg: 0 },
                position: 'relative',
                flexWrap: { xs: 'nowrap', sm: 'nowrap', md: 'nowrap', lg: 'unset' },
              }}
            >
              {/* Icon und vertikale Linie auf kleinen Screens, Icon oben auf lg+ */}
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 3,
                  boxShadow: '0 4px 16px #0001',
                  transform: { xs: 'translateX(100%)', sm: 'translateX(100%)',  md: 'translateX(140%)', lg: 'none' },
                  p: 2,
                  mb: { xs: 0, sm: 0, md: 0, lg: 1 },
                  mt: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 70,
                  minHeight: 70,
                  position: 'relative',
                  zIndex: 2 // Icon über der Linie
                }}
              >
                {phase.icon}
                {/* Vertikale Linie unter dem Icon (nur auf kleinen Screens) */}
                {idx < phases.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '100%',
                      width: 4,
                      height: 40,
                      background:
                        idx === 0
                          ? 'linear-gradient(180deg, #3B82F6 0%, #F59E42 100%)' // blau zu orange
                          : idx === 1
                            ? 'linear-gradient(180deg, #F59E42 0%, #F59E42 100%)' // orange zu orange
                            : 'linear-gradient(180deg, #F59E42 0%, #F87171 100%)', // orange zu rot
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                      display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' }
                    }}
                  />
                )}
              </Box>
              {/* Textblock */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'flex-start', sm: 'flex-start', md: 'flex-start', lg: 'center' },
                justifyContent: 'center',
                transform: { xs: 'translateX(20%)', lg: 'none' },
                minWidth: 0,
                flex: 1,
                textAlign: { xs: 'left', sm: 'left', md: 'left', lg: 'center' },
                ml: { xs: 2, sm: 2, md: 2, lg: 0 },
              }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: phase.color, mb: 0.2 }}>{phase.label}</Typography>
                <Typography sx={{ fontWeight: 400, fontSize: '0.95rem', color: '#222', mb: 0.2 }}>{phase.desc}</Typography>
                <Typography sx={{ fontWeight: 400, fontSize: '0.9rem', color: '#888' }}>{phase.date}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* SHAP-Explanations */}
      {barData.length > 0 && (
        <Box sx={{ width: '100%', mb: isMobile ? 1 : 2 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ 
            mb: isMobile ? 1 : 2, 
            fontSize: isMobile ? '0.9rem' : '1.1rem', 
            fontWeight: 900, 
            color: '#13213C'
          }}>
            Explanation of the prediction
          </Typography>
          <Typography sx={{ 
            color: '#444', 
            fontSize: isMobile ? '0.85rem' : '0.98rem', 
            lineHeight: 1.7, 
            textAlign: 'justify', 
            mb: isMobile ? 1 : 2 
          }}>
            The following bar shows which features had the greatest impact on the result. The larger the colored section, the more important this feature was for the prediction. The legend below explains what the colors stand for.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            width: '100%', 
            height: isMobile ? 24 : 32, 
            borderRadius: 2, 
            overflow: 'hidden', 
            boxShadow: 1, 
            mb: isMobile ? 1 : 2 
          }}>
            {barData.map((item, idx) => (
              <Box
                key={item.feature}
                sx={{ 
                  width: `${item.impact_percentage}%`, 
                  bgcolor: item.color, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#fff', 
                  fontWeight: 600, 
                  fontSize: isMobile ? '0.8rem' : '0.95rem', 
                  borderRight: idx < barData.length - 1 ? '2px solid #fff' : 'none', 
                  transition: 'width 0.3s ease' 
                }}
              >
                {item.impact_percentage > 8
                  ? `${item.impact_percentage.toFixed(1)}%`
                  : (
                      <Tooltip title={`${item.impact_percentage.toFixed(1)}%`} arrow>
                        <Box sx={{ width: '100%', height: '100%' }} />
                      </Tooltip>
                    )
                }
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2, mt: isMobile ? 1 : 2, flexWrap: 'wrap' }}>
            {barData.map(item => (
              <Box key={item.feature} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ 
                  width: isMobile ? 12 : 16, 
                  height: isMobile ? 12 : 16, 
                  bgcolor: item.color, 
                  borderRadius: 1, 
                  mr: 0.5 
                }} />
                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}>{item.feature}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Timeline; 