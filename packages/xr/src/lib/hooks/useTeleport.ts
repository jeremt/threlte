import * as THREE from 'three'
import { useThrelte } from '@threlte/core'
import { useBaseReferenceSpace } from '../internal/useBaseReferenceSpace'

const quaternion = new THREE.Quaternion()
const offset = { x: 0, y: 0, z: 0 }

/**
 * Returns a callback to teleport the player to a position.
 *
 * @example
 * const teleport = useTeleport()
 * const vec3 = new THREE.Vector3()
 *
 * vec3.set(5, 0, 5)
 *
 * teleport(vec3)
 */
export const useTeleport = () => {
  const { xr } = useThrelte().renderer
  const baseReferenceSpace = useBaseReferenceSpace()

  /**
   * Teleports a player to a position - and optionally a direction.
   */
  return (position: THREE.Vector3 | THREE.Vector3Tuple, direction = quaternion) => {
    const space = baseReferenceSpace.current

    if (space === null || space === undefined) return

    let x = 0,
      y = 0,
      z = 0

    if (Array.isArray(position)) {
      ;[x, y, z] = position
    } else {
      x = position.x
      y = position.y
      z = position.z
    }

    offset.x = -x
    offset.y = -y
    offset.z = -z

    const pose = xr.getFrame().getViewerPose(space)
    if (pose !== undefined) {
      offset.x += pose.transform.position.x
      offset.z += pose.transform.position.z
    }

    const teleportOffset = new XRRigidTransform(offset, direction)
    xr.setReferenceSpace(space.getOffsetReferenceSpace(teleportOffset))
  }
}
