'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from 'react'

// 活动类型定义
export type EventType = 'riding' | 'workshop' | 'lecture' | 'other'
export type EventDifficulty = 'easy' | 'medium' | 'hard'
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type RegistrationStatus = 'registered' | 'paid' | 'cancelled' | 'attended'

// 活动注册记录
export interface EventRegistration {
  id: string
  eventId: string
  userId: string
  registrationTime: string
  status: RegistrationStatus
  hasPaid: boolean
  hasAttended: boolean
  additionalInfo?: string
}

// EventContext类型
type EventContextType = {
  registrations: EventRegistration[]
  registerForEvent: (registration: Omit<EventRegistration, 'id' | 'registrationTime'>) => string
  cancelRegistration: (registrationId: string) => void
  getUserRegistrations: (userId: string) => EventRegistration[]
  getEventRegistrations: (eventId: string) => EventRegistration[]
  getRegistration: (userId: string, eventId: string) => EventRegistration | undefined
}

// 创建Context
const EventContext = createContext<EventContextType | undefined>(undefined)

// Provider组件
export function EventProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  
  // 从localStorage加载数据
  useEffect(() => {
    const savedRegistrations = localStorage.getItem('eventRegistrations')
    if (savedRegistrations) {
      try {
        setRegistrations(JSON.parse(savedRegistrations))
      } catch (error) {
        console.error('Error parsing event registrations from localStorage', error)
        setRegistrations([])
      }
    }
  }, [])
  
  // 保存数据到localStorage
  useEffect(() => {
    if (registrations.length > 0) {
      localStorage.setItem('eventRegistrations', JSON.stringify(registrations))
    }
  }, [registrations])
  
  // 注册活动
  const registerForEvent = (registrationData: Omit<EventRegistration, 'id' | 'registrationTime'>) => {
    // 检查用户是否已经注册了该活动
    const existingRegistration = registrations.find(
      r => r.userId === registrationData.userId && r.eventId === registrationData.eventId
    )
    
    if (existingRegistration) {
      // 如果之前取消了，可以重新激活
      if (existingRegistration.status === 'cancelled') {
        setRegistrations(prev => 
          prev.map(reg => 
            reg.id === existingRegistration.id 
              ? { 
                  ...reg, 
                  status: 'registered', 
                  registrationTime: new Date().toISOString(),
                  additionalInfo: registrationData.additionalInfo
                } 
              : reg
          )
        )
        return existingRegistration.id
      }
      return existingRegistration.id // 返回已存在的注册ID
    }
    
    // 创建新注册
    const id = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newRegistration: EventRegistration = {
      ...registrationData,
      id,
      registrationTime: new Date().toISOString()
    }
    
    setRegistrations(prev => [...prev, newRegistration])
    return id
  }
  
  // 取消报名
  const cancelRegistration = (registrationId: string) => {
    setRegistrations(prev => 
      prev.map(registration => 
        registration.id === registrationId 
          ? { ...registration, status: 'cancelled' } 
          : registration
      )
    )
  }
  
  // 获取用户的所有活动报名
  const getUserRegistrations = (userId: string) => {
    return registrations.filter(reg => reg.userId === userId)
  }
  
  // 获取活动的所有报名
  const getEventRegistrations = (eventId: string) => {
    return registrations.filter(reg => reg.eventId === eventId)
  }
  
  // 获取特定用户对特定活动的报名信息
  const getRegistration = (userId: string, eventId: string) => {
    return registrations.find(reg => reg.userId === userId && reg.eventId === eventId)
  }
  
  return (
    <EventContext.Provider value={{
      registrations,
      registerForEvent,
      cancelRegistration,
      getUserRegistrations,
      getEventRegistrations,
      getRegistration
    }}>
      {children}
    </EventContext.Provider>
  )
}

// 自定义Hook
export function useEvents() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
} 