import { Catalog } from '../catalog.mjs'
import { DirectionalFlickResources, getDirectionalFlickResources } from './directional-flick.mjs'
import { LaneResources, getLaneResources } from './lane.mjs'
import { getMiscResources } from './misc.mjs'
import { NoteResources, getNoteResources } from './note.mjs'

export type Resources = Awaited<ReturnType<typeof getResources>>

export const getResources = async (catalog: Catalog) => {
    console.log('Getting resources...')

    const resources = {
        notes: [] as NoteResources[],
        directionalFlicks: [] as DirectionalFlickResources[],
        lanes: [] as LaneResources[],
        misc: await getMiscResources(),
    }

    for (const { id, server, texts } of catalog.notes) {
        resources.notes.push(await getNoteResources(id, server, texts))
    }

    for (const { id, server, texts } of catalog.directionalFlicks) {
        resources.directionalFlicks.push(await getDirectionalFlickResources(id, server, texts))
    }

    for (const { id, server, texts } of catalog.lanes) {
        resources.lanes.push(await getLaneResources(id, server, texts))
    }

    return resources
}

export const clean = (name: string) => (name[0] === '_' ? name.slice(1) : name)
