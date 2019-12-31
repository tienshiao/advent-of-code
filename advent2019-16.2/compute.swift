import MetalKit

let input = "59734319985939030811765904366903137260910165905695158121249344919210773577393954674010919824826738360814888134986551286413123711859735220485817087501645023012862056770562086941211936950697030938202612254550462022980226861233574193029160694064215374466136221530381567459741646888344484734266467332251047728070024125520587386498883584434047046536404479146202115798487093358109344892308178339525320609279967726482426508894019310795012241745215724094733535028040247643657351828004785071021308564438115967543080568369816648970492598237916926533604385924158979160977915469240727071971448914826471542444436509363281495503481363933620112863817909354757361550"
// let input = "03036732577212944063491565474664"
let numbers = input.map { Int32(String($0))! }


let device = MTLCreateSystemDefaultDevice()!
let commandQueue = device.makeCommandQueue()!
let library = try device.makeLibrary(filepath: "compute.metallib")

func computePhase(input: [Int32]) throws -> [Int32] {
  let commandBuffer = commandQueue.makeCommandBuffer()!
  let encoder = commandBuffer.makeComputeCommandEncoder()!
  let pipelineState = try device.makeComputePipelineState(function: library.makeFunction(name: "computePhase")!)
  encoder.setComputePipelineState(pipelineState)

  encoder.setBuffer(device.makeBuffer(bytes: input as [Int32], length: MemoryLayout<Int32>.stride * input.count, options: []),
                    offset: 0, index: 0)
  var count = Int32(input.count)
  encoder.setBytes(&count, length: MemoryLayout<Int32>.size, index: 1)
  let outputBuffer = device.makeBuffer(length: MemoryLayout<Int32>.stride * input.count, options: [])!
  encoder.setBuffer(outputBuffer, offset: 0, index: 2)

  // let threadsPerGroup = MTLSizeMake(pipelineState.maxTotalThreadsPerThreadgroup, 1, 1)
  let threadsPerGrid = MTLSizeMake(input.count, 1, 1)
  let w = pipelineState.threadExecutionWidth
  let h = pipelineState.maxTotalThreadsPerThreadgroup / w
  let threadsPerGroup = MTLSizeMake(w, h, 1)
  // print(pipelineState.maxTotalThreadsPerThreadgroup)
  // print(input.count)
  encoder.dispatchThreads(threadsPerGrid, threadsPerThreadgroup: threadsPerGroup)
  encoder.endEncoding()

  commandBuffer.commit()
  commandBuffer.waitUntilCompleted()

  let outputPointer = outputBuffer.contents().bindMemory(to: Int32.self, capacity: input.count)
  let outputDataBufferPointer = UnsafeBufferPointer<Int32>(start: outputPointer, count: input.count)
  return Array(ContiguousArray<Int32>(outputDataBufferPointer))
}

let offset = Int(
    numbers[0] * 1000000 +
    numbers[1] * 100000 +
    numbers[2] * 10000 +
    numbers[3] * 1000 +
    numbers[4] * 100 +
    numbers[5] * 10 +
    numbers[6] * 1)


var work: [Int32] = []
for _ in 0..<10_000 {
    work.append(contentsOf: numbers)
}
print(work[1024...1031])

for phase in 0..<100 {
  print("executing", phase)
  let output = try computePhase(input: work)
  // print(output)
  work = output
  // break
}

print(offset)
let message = work[offset...offset+7]
print(message)

print(work[1024...1031])


