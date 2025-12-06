<template>
  <button
    :type="props.type"
    :class="buttonClasses"
    :disabled="props.disabled || props.loading"
    @click="handleClick"
    v-bind="$attrs"
  >
    <span v-if="props.loading" class="spinner-border spinner-border-sm me-2"></span>
    <i v-if="props.icon && !props.loading" :class="props.icon" class="me-1"></i>
    <slot>{{ props.label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'
  size?: 'sm' | 'md' | 'lg'
  outline?: boolean
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  outline: false,
  disabled: false,
  loading: false,
  block: false,
  icon: '',
  label: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes = ['btn']
  
  if (props.outline) {
    classes.push(`btn-outline-${props.variant}`)
  } else {
    classes.push(`btn-${props.variant}`)
  }
  
  if (props.size === 'sm') {
    classes.push('btn-sm')
  } else if (props.size === 'lg') {
    classes.push('btn-lg')
  }
  
  if (props.block) {
    classes.push('d-block w-100')
  }
  
  return classes.join(' ')
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  transition: all 0.2s ease;
}

.btn:active {
  transform: translateY(1px);
}
</style>