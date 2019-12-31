#include <metal_stdlib>
using namespace metal;

int getCoefficient(int target, int index) {
  int pattern[4] = {0, 1, 0, -1};
  return pattern[((index + 1) / (target + 1)) % 4];
}

kernel void computePhase(const device int *in [[ buffer(0) ]],
                const device int& length [[ buffer(1)]],
                device int  *out [[ buffer(2) ]],
                uint id [[ thread_position_in_grid ]]) {
  int pattern[4] = {0, 1, 0, -1};
  int sum = 0;
  for (int j = 0; j < length; j++ ) {
    sum += in[j] * pattern[((j + 1) / (id + 1)) % 4];
  }
  out[id] = abs(sum) % 10;

  // out[id]=in[id];
}
