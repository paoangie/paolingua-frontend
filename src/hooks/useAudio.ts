import { useState, useRef, useCallback, useEffect } from 'react'

interface UseAudioReturn {
  isRecording: boolean
  isSupported: boolean
  audioBlob: Blob | null
  audioBase64: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  error: string | null
}

export default function useAudio(): UseAudioReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [isSupported] = useState(() => !!(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  ))

  const startRecording = useCallback(async () => {
    setError(null)
    setAudioBlob(null)
    setAudioBase64(null)
    chunksRef.current = []

    if (!isSupported) {
      setError('Tu navegador no soporta grabación de audio. Usa Chrome o Edge en http://localhost:5173')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setAudioBlob(blob)

        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1]
          setAudioBase64(base64)
        }
        reader.readAsDataURL(blob)

        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.onerror = () => {
        setError('Error durante la grabación')
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch {
      setError(
        'No se pudo acceder al micrófono. Verifica los permisos.'
      )
    }
  }, [isSupported])

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  return {
    isRecording,
    isSupported,
    audioBlob,
    audioBase64,
    startRecording,
    stopRecording,
    error,
  }
}
