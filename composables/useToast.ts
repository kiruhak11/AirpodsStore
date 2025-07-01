export function useToast() {
  return {
    add({ title, description, icon, color }: { title: string; description?: string; icon?: string; color?: string }) {
      alert(`${title}\n${description || ''}`)
    }
  }
} 