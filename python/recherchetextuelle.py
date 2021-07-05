pi = ""
with open('pi1000000.txt', encoding='utf8') as dec:
    for line in dec:
        pi = pi + line[:-1]
        
def rechercheNaive(texte,motif):
    position = []
    for i in range(len(texte)-len(motif)+1):
        j = 0
        while j<len(motif) and texte[i+j] == motif[j]:
            j = j+1
        if j == len(motif):
            position.append(i)
    return position
    
def mcinit(motif,alphabet):
    m = len(motif)
    mc = dict((lettre, m) for lettre in alphabet)
    for i in range(m-1):
        mc[motif[i]] = m-1-i
    return mc

def rechercheMC(texte,motif,alphabet):
    mc = mcinit(motif,alphabet)
    position = []
    i = 0
    while i <= len(texte)-len(motif):
        j = len(motif)-1
        while j>=0 and texte[i+j] == motif[j]:
            j = j-1
        if j <0:
            position.append(i)
            i = i + 1
        else :
            i = i + max(1,j-len(motif)+1+mc[texte[i+j]])
    return position

def bsinit(motif):
    m = len(motif)
    bs = [m]*m
    for j in range(m):
        d = 1
        while d<m and bs[j]==m:
            k = max(j + 1,d)
            while k<m and motif[k-d]==motif[k]:
                k = k + 1
            if k==m and (j-d<0 or motif[j-d]!=motif[j]):
                bs[j] = d
            d = d+1
    return bs

def rechercheBoyerMoore(texte,motif,alphabet):
    mc = mcinit(motif,alphabet)
    bs = bsinit(motif)
    position = []
    i = 0
    while i <= len(texte)-len(motif):
        j = len(motif)-1
        while j>=0 and texte[i+j] == motif[j]:
            j = j-1
        if j <0:
            position.append(i)
            i = i + bs[0]
        else :
            i = i + max(1,j-len(motif)+1+mc[texte[i+j]])
    return position

if __name__ == "__main__":
    from time import time
    t0 = time()
    print(rechercheNaive(pi,'010101'))
    t1 = time()
    print(rechercheMC(pi,'010101','0123456789'))
    t2 = time()
    print(rechercheBoyerMoore(pi,'010101','0123456789'))
    t3 = time()
    print(t1-t0,t2-t1,t3-t2)