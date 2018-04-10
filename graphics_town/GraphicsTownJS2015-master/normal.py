import sys

def sub_list(L1, L2):
    R = []
    for x in xrange(0, len(L1)):
        R.append(L1[x] - L2[x])
    return R

def calc_normal(T):
    U = sub_list(T[1], T[0])
    V = sub_list(T[2], T[0])
    N = [0,0,0]
    N[0] = U[1]*V[2] - U[2]*V[1]
    N[1] = U[2]*V[0] - U[0]*V[2]
    N[2] = U[0]*V[1] - U[1]*V[0]
    return N
#u=[w,0,0], v=[w/2,h,d/2]
#
#
def main(argv):
    f = open(argv[1], "r")
    t_list = []
    t_curr = []
    t_normal = []
    for line in f:
        line = [x.strip() for x in line.split(',')]
        for x in xrange(0,3):
            t_curr.append(float(line[x]))
        t_list.append(t_curr)
        t_curr = []
    f.close()
    for t in xrange(0, len(t_list), 3):
        target = [t_list[t], t_list[t+1], t_list[t+2]]
        t_normal.append(calc_normal(target))
    L = len(t_normal)
    print("NORMALS FOR EACH TRIANGLE: <multiply by -1 to change direction in context>\n\n")
    for x in xrange(0, L):
        print("Triangle: %s - %s - %s" %
            (t_list[3*x], t_list[3*x+1], t_list[3*x+2]))
        print("Normal: %s\n" % t_normal[x])

if __name__ == "__main__":
    main(sys.argv)
