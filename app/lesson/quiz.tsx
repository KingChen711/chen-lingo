'use client'

import React, { useMemo, useState, useTransition } from 'react'

import { challengeOptions, challenges, userSubscriptions } from '@/database/schema'
import Header from './header'
import QuestionBubble from './question-bubble'
import Challenge from './challenge'
import Footer from './footer'
import { upsertChallengeProgress } from '@/actions/challenge-progress.action'
import { toast } from 'sonner'
import { reduceHearts } from '@/actions/user-progress.action'
import { useAudio, useMount, useWindowSize } from 'react-use'
import Image from 'next/image'
import ResultCard from './result-card'
import { useRouter } from 'next/navigation'
import Confetti from 'react-confetti'
import { useHeartsModal } from '@/store/use-hearts-modal'
import { usePracticeModal } from '@/store/use-practice-modal'
import { InfinityIcon } from 'lucide-react'

type Props = {
  initialLessonId: number
  initialPercentage: number
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
  initialHearts: number
  isPro: boolean
}

function Quiz({ initialHearts, initialLessonChallenges, initialLessonId, initialPercentage, isPro }: Props) {
  const { open: openHeartsModal } = useHeartsModal()
  const { open: openPracticeModal } = usePracticeModal()

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal()
    }
  })

  const [lessonId] = useState(initialLessonId) //keep this value
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage
  })
  const [challenges, setChallenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })

  const [selectedOption, setSelectedOption] = useState<number>()
  const [status, setStatus] = useState<'none' | 'correct' | 'wrong'>('none')

  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { height, width } = useWindowSize()

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

  const [correctAudio, _c, correctControls] = useAudio({ src: '/sounds/correct.mp3' })
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: '/sounds/incorrect.mp3' })
  const [finishAudio] = useAudio({ src: '/sounds/finish.mp3', autoPlay: true })

  const handleSelectOption = (optionId: number) => {
    if (status !== 'none') return

    setSelectedOption(optionId)
  }

  const handleNext = () => {
    setActiveIndex((prev) => prev + 1)
  }

  const handleCheck = () => {
    if (pending || !selectedOption) return

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

    const isCorrect = correctOption && correctOption.id === selectedOption

    if (!isCorrect) {
      startTransition(() => {
        reduceHearts(currentChallenge.id)
          .then((res) => {
            if (res?.error === 'hearts') {
              openHeartsModal()
              return
            }

            incorrectControls.play()
            setStatus('wrong')

            if (!res?.error) {
              setHearts((prev) => Math.max(prev - 1, 0))
            }
          })
          .catch(() => {
            toast.error('Something went wrong')
          })
      })

      return
    }

    startTransition(() => {
      upsertChallengeProgress(currentChallenge.id)
        .then((res) => {
          if (res?.error === 'hearts') {
            openHeartsModal()
            return
          }

          correctControls.play()
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
    return (
      <>
        {finishAudio}

        <Confetti recycle={false} numberOfPieces={500} tweenDuration={10000} width={width} height={height} />

        <div className='flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full'>
          <Image src='/finish.svg' alt='finish' className='hidden lg:block' height={100} width={100} />
          <Image src='/finish.svg' alt='finish' className='block lg:hidden' height={50} width={50} />
          <h1 className='text-xl lg:text-3xl font-bold text-neutral-700'>
            Great job! <br /> You&apos;re completed the lesson.
          </h1>
          <div className='flex items-center gap-x-4 w-full'>
            <ResultCard variant='points' value={challenges.length * 10} />
            <ResultCard
              variant='hearts'
              value={isPro ? <InfinityIcon className='h-6 w-6 stroke-[3] shrink-0' /> : hearts}
            />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status='completed'
          onCheck={() => {
            router.push('/learn')
          }}
        />
      </>
    )
  }

  return (
    <>
      {correctAudio}
      {incorrectAudio}
      <Header hearts={hearts} percentages={percentage} hasActiveSubscription={isPro} />
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
      <Footer lessonId={initialLessonId} disabled={pending || !selectedOption} status={status} onCheck={handleCheck} />
    </>
  )
}

export default Quiz
