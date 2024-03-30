'use client'

import React, { useMemo, useState, useTransition } from 'react'

import { challengeOptions, challenges } from '@/database/schema'
import Header from './header'
import QuestionBubble from './question-bubble'
import Challenge from './challenge'
import Footer from './footer'
import { upsertChallengeProgress } from '@/actions/challenge-progress.action'
import { toast } from 'sonner'

type Props = {
  initialLessonId: number
  initialPercentage: number
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
  initialHearts: number
  userSubscription: any
}

function Quiz({ initialHearts, initialLessonChallenges, initialLessonId, initialPercentage, userSubscription }: Props) {
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(initialPercentage)
  const [challenges, setChallenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })
  const [selectedOption, setSelectedOption] = useState<number>()
  const [status, setStatus] = useState<'none' | 'correct' | 'wrong'>('none')

  const [pending, startTransition] = useTransition()

  const currentChallenge = useMemo(() => {
    return challenges[activeIndex] || null
  }, [activeIndex])

  const options = useMemo(() => {
    return currentChallenge?.challengeOptions || []
  }, [currentChallenge])

  const title = useMemo(() => {
    return currentChallenge
      ? currentChallenge.type === 'ASSIST'
        ? 'Select the correct meaning'
        : currentChallenge.question
      : ''
  }, [currentChallenge])

  const handleSelectOption = (optionId: number) => {
    if (status !== 'none') return

    setSelectedOption(optionId)
  }

  const handleNext = () => {
    setActiveIndex((prev) => prev + 1)
  }

  const handleCheck = () => {
    if (!selectedOption) return

    if (status === 'wrong') {
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    if (status === 'correct') {
      handleNext()
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    const correctOption = options.find((option) => option.correct)

    if (correctOption && correctOption.id !== selectedOption) {
      setStatus('wrong')
      return
    }

    if (pending) return

    startTransition(() => {
      upsertChallengeProgress(currentChallenge.id)
        .then((res) => {
          if (res?.error === 'hearts') {
            console.error('Missing hearts')
            return
          }

          setStatus('correct')
          setPercentage((prev) => prev + 100 / challenges.length)

          //This is a practice
          if (initialPercentage === 100) {
            setHearts((prev) => Math.min(prev + 1, 5))
          }
        })
        .catch(() => toast.error('Something went wrong!'))
    })
  }

  if (!currentChallenge) {
    return <div className='text-5xl'>Hoàn thành</div>
  }

  return (
    <>
      <Header hearts={hearts} percentages={percentage} hasActiveSubscription={!!userSubscription?.isActive} />
      <div className='flex-1'>
        <div className='h-full flex items-center justify-center'>
          <div className='lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12'>
            <h1 className='text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700'>{title}</h1>
            <div>
              {currentChallenge.type === 'ASSIST' && <QuestionBubble question={currentChallenge.question} />}

              <Challenge
                options={options}
                onSelectOption={handleSelectOption}
                status={status}
                selectedOption={selectedOption}
                disabled={pending || status !== 'none'}
                type={currentChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={pending || !selectedOption} status={status} onCheck={handleCheck} />
    </>
  )
}

export default Quiz
