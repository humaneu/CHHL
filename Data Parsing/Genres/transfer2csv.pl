#!/usr/bin/perl
use strict;
use warnings;

use JSON qw( decode_json);
use Data::Dumper;

my $in_file = "Movie_genres.json";
my $out_file = "genres.csv";

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
my %genres;

for (my $i = 0; $i < $size; $i++) {
	chomp $arr[$i];
	my $parse = decode_json ($arr[$i]);
	my $key = $parse->{'genres'};
	$genres{$key} = 1;
}

my @name = keys %genres;
print OUTFILE "genres", "\n";
foreach (@name) {
	print OUTFILE $_,"\n";
}
