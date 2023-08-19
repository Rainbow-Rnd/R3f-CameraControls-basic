import * as React from 'react'
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function LinearProgressWithLabel(props) {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
      <Typography variant="h5" gutterBottom color="white">
        촬영 영상을 3D 모델로 변환 중입니다...
      </Typography>
      <Box sx={{ width: '50%', mb: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="white">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  )
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired
}

export default function LinearWithValueLabel() {
  const [progress, setProgress] = React.useState(10)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10))
    }, 8000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative'
      }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  )
}
