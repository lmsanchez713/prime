cmake_minimum_required(VERSION 3.10)

# set the project name
project(prime VERSION 0.69)

# specify the C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# add the executable
add_executable(prime prime.cxx)

configure_file(prime_config.h.in prime_config.h)

target_include_directories(prime PUBLIC "${PROJECT_BINARY_DIR}")

# specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
