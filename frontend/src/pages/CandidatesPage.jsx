import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, TextField, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CandidateCard from '../components/candidates/display/CandidateCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5100/candidates');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Kandidaten');
        }
        const data = await response.json();
        setCandidates(data);
        setFilteredCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const filtered = candidates.filter(candidate => {
      const name = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                           candidate.linkedinProfile?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModel = selectedModel === 'all' || candidate.modelType === selectedModel;
      
      return matchesSearch && matchesModel;
    });
    setFilteredCandidates(filtered);
  }, [searchTerm, selectedModel, candidates]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 4 }}>
        <Typography variant="h2" sx={{ mb: 3, color: '#1a1a1a', fontSize: '1.5rem', fontWeight: 600 }}>
          Fehler
        </Typography>
        <Typography sx={{ color: '#dc3545' }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto'}}>
      <Typography variant="h1" sx={{
        fontSize: '2rem',
        fontWeight: 700,
        color: '#1a1a1a',
        mb: 1.6
      }}>
        Kandidaten
      </Typography>

      <Typography sx={{
        color: '#666',
        mb: 3.2,
        fontSize: '0.8rem',
        maxWidth: '640px'
      }}>
        Hier können Sie alle gespeicherten Kandidaten einsehen.
      </Typography>

      <Box sx={{
        bgcolor: '#fff',
        borderRadius: '13px',
        p: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        mb: 3.2,
        width: '100%'
      }}>
        <Typography variant="h2" sx={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 2.4
        }}>
          Kandidaten suchen
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
          <TextField 
            placeholder="Nach Name oder LinkedIn-Profil suchen..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              width: '100%',
              '& .MuiOutlinedInput-root': {
                bgcolor: '#fff',
                borderRadius: '9.6px',
                '& fieldset': {
                  borderColor: '#001B41',
                  borderWidth: 1.6,
                  transition: 'all 0.3s ease'
                },
                '&:hover fieldset': {
                  borderColor: '#FF8000',
                  borderWidth: 1.6
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF8000',
                  borderWidth: 1.6
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{ color: '#001B41', '&:hover': { color: '#FF8000' } }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            gap: 1.6, 
            flexWrap: 'wrap',
          }}>
            <Button
              variant={selectedModel === 'all' ? 'contained' : 'outlined'}
              onClick={() => setSelectedModel('all')}
              sx={{
                bgcolor: selectedModel === 'all' ? '#001B41' : 'transparent',
                color: selectedModel === 'all' ? '#fff' : '#001B41',
                height: '36px',
                minWidth: '96px',
                borderRadius: '6.4px',
                border: '1.6px solid #001B41',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: selectedModel === 'all' ? '#FF8000' : '#fff',
                  borderColor: '#FF8000',
                  color: selectedModel === 'all' ? '#fff' : '#FF8000',
                  transform: 'translateY(-1.6px)',
                  boxShadow: '0 3.2px 6.4px rgba(0,0,0,0.1)'
                }
              }}
            >
              Alle Modelle
            </Button>
            <Button
              variant={selectedModel === 'gru' ? 'contained' : 'outlined'}
              onClick={() => setSelectedModel('gru')}
              sx={{
                bgcolor: selectedModel === 'gru' ? '#001B41' : 'transparent',
                color: selectedModel === 'gru' ? '#fff' : '#001B41',
                height: '36px',
                minWidth: '96px',
                borderRadius: '6.4px',
                border: '1.6px solid #001B41',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: selectedModel === 'gru' ? '#FF8000' : '#fff',
                  borderColor: '#FF8000',
                  color: selectedModel === 'gru' ? '#fff' : '#FF8000',
                  transform: 'translateY(-1.6px)',
                  boxShadow: '0 3.2px 6.4px rgba(0,0,0,0.1)'
                }
              }}
            >
              GRU
            </Button>
            <Button
              variant={selectedModel === 'tft' ? 'contained' : 'outlined'}
              onClick={() => setSelectedModel('tft')}
              sx={{
                bgcolor: selectedModel === 'tft' ? '#001B41' : 'transparent',
                color: selectedModel === 'tft' ? '#fff' : '#001B41',
                height: '36px',
                minWidth: '96px',
                borderRadius: '6.4px',
                border: '1.6px solid #001B41',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: selectedModel === 'tft' ? '#FF8000' : '#fff',
                  borderColor: '#FF8000',
                  color: selectedModel === 'tft' ? '#fff' : '#FF8000',
                  transform: 'translateY(-1.6px)',
                  boxShadow: '0 3.2px 6.4px rgba(0,0,0,0.1)'
                }
              }}
            >
              TFT
            </Button>
            <Button
              variant={selectedModel === 'xgboost' ? 'contained' : 'outlined'}
              onClick={() => setSelectedModel('xgboost')}
              sx={{
                bgcolor: selectedModel === 'xgboost' ? '#001B41' : 'transparent',
                color: selectedModel === 'xgboost' ? '#fff' : '#001B41',
                height: '36px',
                minWidth: '96px',
                borderRadius: '6.4px',
                border: '1.6px solid #001B41',
                fontSize: '0.8rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: selectedModel === 'xgboost' ? '#FF8000' : '#fff',
                  borderColor: '#FF8000',
                  color: selectedModel === 'xgboost' ? '#fff' : '#FF8000',
                  transform: 'translateY(-1.6px)',
                  boxShadow: '0 3.2px 6.4px rgba(0,0,0,0.1)'
                }
              }}
            >
              XGBoost
            </Button>
          </Box>
        </Box>
      </Box>

      {filteredCandidates.length === 0 ? (
        <Box sx={{
          bgcolor: '#fff',
          borderRadius: '13px',
          p: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center',
          width: '100%'
        }}>
          <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
            {searchTerm ? 'Keine Kandidaten gefunden, die den Suchkriterien entsprechen.' : 'Keine Kandidaten gespeichert.'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 2.4,
          width: '100%'
        }}>
          {filteredCandidates.map((candidate) => (
            <CandidateCard 
              key={candidate._id} 
              candidate={candidate} 
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CandidatesPage; 