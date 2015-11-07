# Actually this one does not work, because of the decoder issue
# use python one instead

#!/usr/bin/perl
use strict;
use warnings;

use utf8;
use Text::Unidecode;

use JSON qw( decode_json);
use Data::Dumper;

my $in_file = "Person_transfered.json";
my $out_file = "Person.csv";

if (! $in_file) {
	die "Sorry, but can not find this file\n";
}

unless (open(INFILE, "<", $in_file)) {
	die "Can't open file", $in_file, " ", $!;
}

unless (open(OUTFILE, ">", $out_file)) {
	die "Can't open file", $out_file, " for writing". $!;
};

my @arr = <INFILE>;
my $size = @arr;

foreach(@arr){
	$_ =~  s/([^[:ascii:]]+)/unidecode($1)/ge;
}

print OUTFILE "personId", ",name", ",dayofbirth", ",biography", "\n";
for (my $i = 0; $i < $size; $i++) {
	chomp $arr[$i];
	my $parse = decode_json ($arr[$i]);
	print OUTFILE $parse->{'personId'}, ",",$parse->{'name'},",",$parse->{'dayofbirth'}, ",",$parse->{'biography'},"\n";
}
