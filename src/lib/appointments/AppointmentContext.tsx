'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { Appointment, AppointmentStatus } from '@/lib/services/types'

type AppointmentContextType = {
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (appointmentId: string) => void
  getAppointmentById: (appointmentId: string) => Appointment | undefined
  userAppointments: (userId?: string) => Appointment[]
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined)

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // 初始化 - 从本地存储加载预约信息
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments')
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments))
      } catch (error) {
        console.error('Error parsing appointments from localStorage', error)
        setAppointments([])
      }
    }
  }, [])

  // 保存到本地存储
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments))
    }
  }, [appointments])

  // 添加新预约
  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment])
  }

  // 取消预约
  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'cancelled' as AppointmentStatus, updatedAt: new Date().toISOString() } 
          : appointment
      )
    )
  }

  // 根据ID获取预约信息
  const getAppointmentById = (appointmentId: string) => {
    return appointments.find(appointment => appointment.id === appointmentId)
  }

  // 获取用户的所有预约
  const userAppointments = (userId?: string) => {
    if (!userId) return appointments
    return appointments.filter(appointment => appointment.userId === userId)
  }

  return (
    <AppointmentContext.Provider value={{
      appointments,
      addAppointment,
      cancelAppointment,
      getAppointmentById,
      userAppointments
    }}>
      {children}
    </AppointmentContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentContext)
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider')
  }
  return context
} 