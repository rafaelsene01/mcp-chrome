<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">Corresponder por trecho da URL (prioritário)</label>
      <input
        class="form-input"
        v-model="(node as any).config.frame.urlContains"
        placeholder="Texto contido na URL do frame"
      />
    </div>
    <div class="form-group">
      <label class="form-label">Corresponder por índice (a partir de 0, só frames filhos)</label>
      <input class="form-input" v-model="(node as any).config.frame.index" placeholder="Número do índice" />
    </div>
    <div class="text-xs text-slate-500" style="padding: 0 20px"
      >Funciona em frames de mesma origem/injetáveis; vazio volta para a página principal</div
    >
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
import type { NodeBase } from '@/entrypoints/background/record-replay/types';
defineProps<{ node: NodeBase }>();
</script>

<style scoped></style>
