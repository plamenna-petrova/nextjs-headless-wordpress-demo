'use client'

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { type StoreApi, createStore, useStore } from 'zustand'

import { convertRemToPx } from '@/lib/remToPx'

export interface Section {
  id: string
  title: string
  offsetRem?: number
  tag?: string
  headingRef?: React.RefObject<HTMLHeadingElement>
}

interface SectionState {
  sections: Array<Section>
  visibleSections: Array<string>
  setVisibleSections: (visibleSections: Array<string>) => void
  registerHeading: ({
    id,
    ref,
    offsetRem,
  }: {
    id: string
    ref: React.RefObject<HTMLHeadingElement>
    offsetRem: number
  }) => void
}

function createSectionStore(sections: Array<Section>) {
  return createStore<SectionState>()((set) => ({
    sections,
    visibleSections: [],
    setVisibleSections: (visibleSections) =>
      set((state) => {
        console.log('in state');
        console.log(state.visibleSections);

        console.log('to set');
        console.log(visibleSections);

        return state.visibleSections.join() === visibleSections.join()
          ? {}
          : { visibleSections }
      }),
    registerHeading: ({ id, ref, offsetRem }) =>
      set((state) => {
        console.log(`📌 Registering heading: ${id}`, ref.current);
        return {
          sections: state.sections.map((section) => {
            if (section.id === id) {
              return {
                ...section,
                headingRef: ref,
                offsetRem,
              }
            }
            return section
          }),
        }
      }),
  }))
}

function useVisibleSections(sectionStore: StoreApi<SectionState>) {
  let setVisibleSections = useStore(sectionStore, (s) => s.setVisibleSections)
  let sections = useStore(sectionStore, (s) => s.sections)

  console.log('sections in use');
  console.log(sections);

  useEffect(() => {
    console.log('🛠️ useVisibleSections: Setting up scroll listeners');

    function checkVisibleSections() {
      let { innerHeight, scrollY } = window;
      let newVisibleSections: string[] = [];

      console.log('🟡 Running checkVisibleSections');

      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        let { id, headingRef, offsetRem = 0 } = sections[sectionIndex];

        if (!headingRef?.current) {
          console.log(`⚠️ Skipping section "${id}" because headingRef is null`);
          continue;
        }

        let offset = convertRemToPx(offsetRem);
        let top = headingRef.current.getBoundingClientRect().top + scrollY;

        console.log(`📍 Section "${id}" -> top: ${top}, scrollY: ${scrollY}`);

        if (sectionIndex === 0 && top - offset > scrollY) {
          newVisibleSections.push('_top');
        }

        let nextSection = sections[sectionIndex + 1];
        let bottom =
          (nextSection?.headingRef?.current?.getBoundingClientRect().top ?? Infinity) +
          scrollY - convertRemToPx(nextSection?.offsetRem ?? 0);

        if (
          (top > scrollY && top < scrollY + innerHeight) ||
          (bottom > scrollY && bottom < scrollY + innerHeight) ||
          (top <= scrollY && bottom >= scrollY + innerHeight)
        ) {
          newVisibleSections.push(id);
        }
      }

      console.log('🟢 New visible sections:', newVisibleSections);

      setVisibleSections(newVisibleSections);
    }

    let raf = window.requestAnimationFrame(() => checkVisibleSections())
    window.addEventListener('scroll', checkVisibleSections, { passive: true })
    window.addEventListener('resize', checkVisibleSections)

    return () => {
      console.log('🛑 Removing scroll listeners');
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', checkVisibleSections);
      window.removeEventListener('resize', checkVisibleSections);
    }
  }, [setVisibleSections, sections])
}

const SectionStoreContext = createContext<StoreApi<SectionState> | null>(null)

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function SectionProvider({
  sections,
  children,
}: {
  sections: Array<Section>
  children: React.ReactNode
  }) {
  console.log('received sections');
  console.log(sections);
  
  let [sectionStore] = useState(() => createSectionStore(sections))

  useVisibleSections(sectionStore)

  useIsomorphicLayoutEffect(() => {
    sectionStore.setState({ sections })
  }, [sectionStore, sections])

  return (
    <SectionStoreContext.Provider value={sectionStore}>
      {children}
    </SectionStoreContext.Provider>
  )
}

export function useSectionStore<T>(selector: (state: SectionState) => T) {
  let store = useContext(SectionStoreContext)
  return useStore(store!, selector)
}