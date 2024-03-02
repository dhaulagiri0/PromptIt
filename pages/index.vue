<script setup>
</script>

<template>
  <div class="bg-slate-900 h-dvh p-5">
    <Header />
    <UserNormal />
    <UserLobby />
    <WindowCard headerColor="grapefruit">
      <ConsoleDisplay text="test display text"/>
      <ConsoleField />
      <ThiccButton color="grapefruit">
        <h3>Join a game</h3>
      </ThiccButton>
      <ThiccButton color="offwhite">
        <h3>Start a new game</h3>
      </ThiccButton>
    </WindowCard>
  </div>
</template>
