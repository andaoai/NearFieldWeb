<template>
  <div>
    <object type='application/x-vlc-plugin' id='vlc' events='false' width="100%" height="500">
    <param name='mrl' value='rtsp://10.0.0.3:8554/live' />
    <param name='volume' value='50' />
    <param name='autoplay' value='true' />
    <param name='loop' value='false' />
    <param name='fullscreen' value='false' />
    <param name='controls' value='false' />
  </object>
  </div>
</template>

<script>
export default {
  
}

</script>