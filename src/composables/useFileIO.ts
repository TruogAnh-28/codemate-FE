const EXTENSIONS: Record<number, string> = {
  50: 'c',
  54: 'cpp',
  59: 'cpp',
  76: 'cpp',
  51: 'cs',
  62: 'java',
  63: 'js',
  70: 'py',
  71: 'py',
  60: 'go',
  72: 'rb',
  73: 'rs',
  83: 'swift',
  78: 'kt',
  74: 'ts',
  68: 'php',
  85: 'pl',
  81: 'scala',
  61: 'hs',
  64: 'lua',
  80: 'r'
}

export function useFileIO() {
  const importCode = (callback: (code: string) => void) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.c,.cpp,.cs,.java,.js,.py,.go,.rb,.rs,.swift,.kt,.ts,.php,.pl,.scala,.hs,.lua,.r'
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0]
        const text = await file.text()
        callback(text)
      }
    }
    input.click()
  }

  const exportCode = (code: string, langId: number) => {
    const extension = EXTENSIONS[langId] || 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `solution.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return { importCode, exportCode }
}

