cmake_minimum_required(VERSION 3.10)

# set the project name
project(primex_server VERSION 0.69)

# specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# add the executable
add_executable(primex_server main.cxx)

target_include_directories(primex_server PUBLIC "/usr/local/boost_1_77_0")

# configure_file(prime_config.h.in prime_config.h)

# target_include_directories(prime PUBLIC "${PROJECT_BINARY_DIR}")
