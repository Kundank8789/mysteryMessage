'use client'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import {useState} from 'react'
import {useDebounceValue} from "usehooks-ts"
import {useToast} from '@/components/ui/use-toast'

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username, 500)
  const {toast} = useToast()
  return (
    <div>page</div>
  )
}

export default page