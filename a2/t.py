from __future__ import print_function
import math
import sys

def main(argv):
    dia = [4879, 12104, 12756, 6792, 142984, 120536, 51118, 49528, 2370]
    mass = [0.330, 4.87, 5.97, 0.642, 1898, 568, 86.8, 102, 0.0146]
    prd = [1407.6, -5832.5, 23.9, 24.6, 9.9, 10.7, -17.2, 16.1, -153.3]
    dsun = [57.9, 108.2, 149.6, 227.9, 778.6, 1433.5, 2872.5, 4495.1, 5906.4]
    oprd = [88.0, 224.7, 365.2, 687.0, 4331, 10747, 30589, 59800, 90560]
    
    d1 = dia[0]
    m1 = mass[0]
    p1 = prd[0]
    ds1 = dsun[0]
    o1 = oprd[0]

    for i in range(0, 9):
        dia[i] = (dia[i] / d1)
        mass[i] =(mass[i] / m1)
        prd[i] = (prd[i] / p1)
        dsun[i] = (dsun[i] / ds1)
        oprd[i] = (oprd[i] / o1)

    print("\tMercury   Venus   Earth   Mars   Jupiter   Saturn   Uranus   Neptune   Pluto")
    print("Diam: ", end=" ")
    for i in dia:
        print("%4.2f\t " % i, end=" ")
    print("")
    print("Mass: ", end=" ")
    for i in mass:
        print("%4.2f\t " % i, end=" ")
    print("")
    print("Peri: ", end=" ")
    for i in prd:
        print("%4.2f\t " % i, end=" ")
    print("")
    print("Dist: ", end=" ")
    for i in dsun:
        print("%4.2f\t " % i, end=" ")
    print("")
    print("OPer: ", end=" ")
    for i in oprd:
        print("%4.2f\t " % i, end=" ")
    print("")

if __name__ == "__main__":
    main(sys.argv)
